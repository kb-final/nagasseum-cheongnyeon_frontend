<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import MobileContainer from '@/shared/components/molecules/MobileContainer.vue'
import { formatManwon } from '@/shared/utils/formatter'

import { useAuthStore } from '@/features/auth'

import { getGoalComparison } from '@/features/compare/api/compareApi'
import AchievementHistogramCard from '@/features/compare/components/AchievementHistogramCard.vue'
import CohortConditionCard from '@/features/compare/components/CohortConditionCard.vue'
import CohortEditSheet from '@/features/compare/components/CohortEditSheet.vue'
import CompareLockedCard from '@/features/compare/components/CompareLockedCard.vue'
import DealTypeDistributionCard from '@/features/compare/components/DealTypeDistributionCard.vue'
import PopularRegionsCard from '@/features/compare/components/PopularRegionsCard.vue'
import SavingRangeCard from '@/features/compare/components/SavingRangeCard.vue'

import lockImage from '@/features/compare/assets/lock.png'

// 코호트 비교 범위. 사용자가 '수정'에서 바꿀 수 있어야 해서 상수가 아닌 상태로 둔다.
// TODO: 서버에 사용자별 코호트 설정을 저장하는 테이블이 생기면 그 값으로 초기화
const assetRange = ref(10_000_000)
const ageRange = ref(2)

// '또래 비교 데이터 제공' 약관 동의 여부. 회원가입·마이페이지 토글에서 정해진다.
// 값을 모르면 동의 안 한 것으로 본다. 개인정보라 열어두는 쪽으로 기울면 안 된다.
const authStore = useAuthStore()
const hasCompareConsent = computed(() => authStore.user?.notifications?.peerComparison ?? false)

const status = ref('loading') // loading | ready | insufficient | no-snapshot | no-consent | error
const comparison = ref(null)
const isEditOpen = ref(false)

function applyCohort({ assetRange: nextAsset, ageRange: nextAge }) {
  isEditOpen.value = false
  // 값이 바뀌면 아래 watch가 재조회한다.
  assetRange.value = nextAsset
  ageRange.value = nextAge
}

/** 응답의 snapshotYm('2026-07')을 '2026.07.01'로 바꾼다. 집계는 매월 1일 기준이다. */
const snapshotLabel = computed(() => {
  const digits = String(comparison.value?.snapshotYm ?? '').replace(/\D/g, '')
  return digits.length >= 6 ? `${digits.slice(0, 4)}.${digits.slice(4, 6)}.01` : ''
})

async function fetchComparison() {
  // 어차피 거절당할 요청이므로 보내지 않는다.
  if (!hasCompareConsent.value) {
    status.value = 'no-consent'
    return
  }

  status.value = 'loading'
  try {
    const body = await getGoalComparison({
      assetRange: assetRange.value,
      ageRange: ageRange.value,
    })
    if (body.data?.cohort?.sufficient === false) {
      comparison.value = body.data
      status.value = 'insufficient'
      return
    }
    comparison.value = body.data
    status.value = 'ready'
  } catch (error) {
    // TODO: 백엔드 완성 후 COMPARISON_NO_SNAPSHOT 응답 형태 확인해 분기 보정
    if (error.response?.status === 404) {
      status.value = 'no-snapshot'
    } else if (error.response?.status === 403) {
      // 클라이언트가 들고 있던 동의 정보가 오래됐을 때를 위한 보루.
      status.value = 'no-consent'
    } else {
      status.value = 'error'
    }
  }
}

// 마이페이지에서 동의를 켜고 돌아왔을 때도 다시 불러온다.
watch([assetRange, ageRange, hasCompareConsent], fetchComparison)

onMounted(fetchComparison)
</script>

<template>
  <MobileContainer class="compare-view">
    <header class="compare-view__header">
      <h1>또래 비교</h1>
      <p v-if="snapshotLabel">집계 기준 {{ snapshotLabel }} · 매월 1일 갱신</p>
    </header>

    <div class="compare-view__body">
      <p v-if="status === 'loading'" class="compare-view__notice">불러오는 중...</p>

      <p v-else-if="status === 'error'" class="compare-view__notice">
        비교 결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
      </p>

      <CompareLockedCard v-else-if="status === 'no-consent'" />

      <div v-else-if="status === 'no-snapshot'" class="state-card">
        <span class="state-card__eyebrow">404 · COMPARISON_NO_SNAPSHOT</span>
        <p class="state-card__title">아직 비교할 내 목표가 없어요</p>
        <p class="state-card__body">목표를 설정하면 이번 달 집계부터 또래와 비교해서 보여드려요.</p>
        <RouterLink class="state-card__cta" to="/">목표 설정하러 가기</RouterLink>
      </div>

      <div v-else-if="status === 'insufficient'" class="state-card">
        <span class="state-card__eyebrow">200 · sufficient: false</span>
        <p class="state-card__title">비교할 또래가 충분하지 않아요</p>
        <p class="state-card__body">
          같은 자산·나이 범위의 또래가 {{ comparison.cohort.cohortSize }}명뿐이에요. 최소
          {{ comparison.cohort.minimumRequired }}명이 모이면 정확한 비교 결과를 보여드릴게요.
        </p>
        <div class="state-card__gauge">
          <span class="state-card__gauge-track">
            <span
              class="state-card__gauge-fill"
              :style="{
                width: `${(comparison.cohort.cohortSize / comparison.cohort.minimumRequired) * 100}%`,
              }"
            ></span>
          </span>
          <span class="state-card__gauge-label">
            {{ comparison.cohort.cohortSize }} / {{ comparison.cohort.minimumRequired }}명
          </span>
        </div>
      </div>

      <template v-else-if="status === 'ready' && comparison">
        <CohortConditionCard
          :cohort-size="comparison.cohort.cohortSize"
          :asset-range-label="`자산 ±${formatManwon(comparison.cohort.assetRange)}`"
          :age-range-label="`나이 ±${comparison.cohort.ageRange}세`"
          @edit="isEditOpen = true"
        />

        <DealTypeDistributionCard
          :top-deal-type="comparison.dealTypeDistribution.items[0].label"
          :top-deal-ratio="comparison.dealTypeDistribution.items[0].ratio"
          :items="comparison.dealTypeDistribution.items"
        />

        <div class="stat-pair">
          <div class="stat-card">
            <div class="stat-card__label">평균 목표 자산</div>
            <div class="stat-card__value">{{ formatManwon(comparison.averageTargetAmount) }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__label">평균 준비 기간</div>
            <div class="stat-card__value">{{ comparison.averagePrepMonths }}개월</div>
          </div>
        </div>

        <AchievementHistogramCard
          :my-rate="comparison.achievementDistribution.myRate"
          :cohort-average-rate="comparison.achievementDistribution.cohortAverageRate"
          :buckets="comparison.achievementDistribution.buckets"
        />

        <PopularRegionsCard :regions="comparison.popularRegions" />

        <SavingRangeCard
          :my-monthly-saving="comparison.savingRange.myMonthlySaving"
          :cohort-range-min="comparison.savingRange.cohortRangeMin"
          :cohort-range-max="comparison.savingRange.cohortRangeMax"
        />

        <div class="disclaimer">
          <p class="disclaimer__title">
            <img class="disclaimer__icon" :src="lockImage" alt="" />개인 정보 보호 안내
          </p>
          <p class="disclaimer__body">
            개인별 목표·자산은 절대 노출되지 않으며,<br />집계 통계만 사용됩니다.
          </p>
        </div>
      </template>
    </div>

    <!-- 열 때마다 새로 만들어야 사본(draft)이 현재 값으로 초기화된다. -->
    <CohortEditSheet
      v-if="isEditOpen"
      :asset-range="assetRange"
      :age-range="ageRange"
      @apply="applyCohort"
      @close="isEditOpen = false"
    />
  </MobileContainer>
</template>

<style scoped>
/* 폭·좌우 여백은 MobileLayout이 잡는다. 여기서 또 주면 이중으로 들어간다. */
.compare-view {
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* 루트의 145%는 18px 기준으로 계산된 26.1px이 그대로 상속된다.
     단위 없는 값으로 덮어써야 각 요소가 제 폰트 크기로 줄 높이를 계산한다. */
  line-height: 1.45;
}

.compare-view__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 0 6px;
  text-align: center;
}

.compare-view__header h1 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--text-h);
}

.compare-view__header p {
  margin: 0;
  font-size: 11.5px;
  color: var(--text);
}

.compare-view__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.compare-view__notice {
  padding: 24px 0;
  text-align: center;
  font-size: 13px;
  color: var(--text);
}

.stat-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stat-card {
  /* 이 카드에서만 쓰는 색 */
  --mint: #cdedd3;
  --ink: #10130f;
  --ink-muted: #4e5c50;

  border-radius: 12px;
  background: var(--mint);
  padding: 14px;
}

.stat-card__label {
  font-size: 12px;
  color: var(--ink-muted);
}

.stat-card__value {
  margin-top: 2px;
  font-size: 18px;
  line-height: 1.2;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.disclaimer {
  /* 이 블록에서만 쓰는 색 */
  --surface: #171b16;
  --body: #7f8a7d;

  margin: 4px 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  text-align: center;
  font-size: 12px;
  line-height: 1.55;
  color: var(--body);
}

.disclaimer__title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin: 0;
  color: var(--text-h);
}

/* 원본이 11px이라 등배로 써야 픽셀이 고르게 나온다. */
.disclaimer__icon {
  flex: none;
  width: 11px;
  height: 11px;
  image-rendering: pixelated;
}

.disclaimer__body {
  margin: 4px 0 0;
}

/* 예외 상태 카드 */
.state-card {
  border-radius: 18px;
  background: var(--card-bg, #161616);
  border: 1px solid var(--border);
  padding: 16px;
}

.state-card__eyebrow {
  display: inline-flex;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(193, 68, 46, 0.16);
  color: #e37a63;
  font-size: 10px;
  font-weight: 600;
  margin-bottom: 9px;
}

.state-card__title {
  margin: 0 0 5px;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-h);
}

.state-card__body {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--text);
}

.state-card__cta {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  padding: 8px 15px;
  border-radius: 999px;
  background: var(--accent);
  color: var(--color-mint-deep);
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.state-card__gauge {
  margin-top: 11px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.state-card__gauge-track {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: var(--border);
  overflow: hidden;
}

.state-card__gauge-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--color-point);
}

.state-card__gauge-label {
  font-size: 10.5px;
  color: var(--text);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
</style>
