<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import { formatManwon } from '@/shared/utils/formatter'

import { useMemberStore } from '@/features/member/store/memberStore'

import { getGoalComparison } from '@/features/compare/api/compareApi'
import AchievementHistogramCard from '@/features/compare/components/AchievementHistogramCard.vue'
import CohortConditionCard from '@/features/compare/components/CohortConditionCard.vue'
import CohortEditSheet from '@/features/compare/components/CohortEditSheet.vue'
import CompareLockedCard from '@/features/compare/components/CompareLockedCard.vue'
import DealTypeDistributionCard from '@/features/compare/components/DealTypeDistributionCard.vue'
import PopularRegionsCard from '@/features/compare/components/PopularRegionsCard.vue'
import SavingRangeCard from '@/features/compare/components/SavingRangeCard.vue'

import lockImage from '@/features/compare/assets/lock.png'

const DEFAULT_ASSET_RANGE = 10_000_000
const DEFAULT_AGE_RANGE = 2

/**
 * 비교 범위의 최댓값. CohortEditSheet의 슬라이더 상한과 같은 값이다.
 * 이미 최대로 넓힌 사람에게 "넓혀보라"고 하면 안 되므로 여기서도 알아야 한다.
 */
const MAX_ASSET_RANGE = 30_000_000
const MAX_AGE_RANGE = 5

/**
 * 코호트 비교 범위는 사용자 데이터가 아니라 화면 필터라서 서버에 저장하지 않는다.
 * 브라우저에만 남겨두고, 없거나 깨졌으면 기본값으로 돌아간다.
 */
const COHORT_STORAGE_KEY = 'compare-cohort-range'

function loadCohortRange() {
  try {
    const saved = JSON.parse(localStorage.getItem(COHORT_STORAGE_KEY))
    return {
      assetRange: Number(saved?.assetRange) || DEFAULT_ASSET_RANGE,
      ageRange: Number(saved?.ageRange) || DEFAULT_AGE_RANGE,
    }
  } catch {
    return { assetRange: DEFAULT_ASSET_RANGE, ageRange: DEFAULT_AGE_RANGE }
  }
}

const savedRange = loadCohortRange()
const assetRange = ref(savedRange.assetRange)
const ageRange = ref(savedRange.ageRange)

// '또래 비교 데이터 제공' 약관 동의 여부. 회원가입·마이페이지 토글에서 정해진다.
// 값을 모르면 동의 안 한 것으로 본다. 개인정보라 열어두는 쪽으로 기울면 안 된다.
const memberStore = useMemberStore()
const hasCompareConsent = computed(() => memberStore.profile?.compareDataAgreed ?? false)

const status = ref('loading') // loading | ready | insufficient | no-snapshot | no-asset | no-consent | error
const comparison = ref(null)
const isEditOpen = ref(false)

function applyCohort({ assetRange: nextAsset, ageRange: nextAge }) {
  isEditOpen.value = false
  // 값이 바뀌면 아래 watch가 재조회한다.
  assetRange.value = nextAsset
  ageRange.value = nextAge
  localStorage.setItem(
    COHORT_STORAGE_KEY,
    JSON.stringify({ assetRange: nextAsset, ageRange: nextAge }),
  )
}

/** 아직 넓힐 여지가 있는지. 둘 다 최대면 범위를 건드려도 소용이 없다. */
const canWidenCohort = computed(
  () => assetRange.value < MAX_ASSET_RANGE || ageRange.value < MAX_AGE_RANGE,
)

/** 응답의 snapshotYm('2026-07')을 '2026.07.01'로 바꾼다. 집계는 매월 1일 기준이다. */
const snapshotLabel = computed(() => {
  const digits = String(comparison.value?.snapshotYm ?? '').replace(/\D/g, '')
  return digits.length >= 6 ? `${digits.slice(0, 4)}.${digits.slice(4, 6)}.01` : ''
})

/**
 * 집계 기준일이 오래됐는지. 기능명세서 예외 흐름:
 *   "배치 지연 → 마지막 집계 기준일 표시 / 집계 기준일 2주 초과 → 기준일 라벨 표시"
 */
const STALE_DAYS = 14
const isSnapshotStale = computed(() => {
  const digits = String(comparison.value?.snapshotYm ?? '').replace(/\D/g, '')
  if (digits.length < 6) return false
  const base = new Date(Number(digits.slice(0, 4)), Number(digits.slice(4, 6)) - 1, 1)
  return (Date.now() - base.getTime()) / 86_400_000 > STALE_DAYS
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
    if (error.response?.status === 404) {
      // 같은 404라도 이유가 다르다. 상태 코드가 아니라 에러 코드로 갈라야 한다.
      //   COMPARE_001 목표 자체가 없음        → 목표를 세우러 보낸다
      //   COMPARE_004 목표는 있으나 자산이 없음 → 자산 연동으로 보낸다
      const code = error.response.data?.error?.code
      status.value = code === 'COMPARE_004' ? 'no-asset' : 'no-snapshot'
    } else if (error.response?.status === 403) {
      // 클라이언트가 들고 있던 동의 정보가 오래됐을 때를 위한 보루.
      status.value = 'no-consent'
    } else {
      status.value = 'error'
    }
  }
}

// 비교 범위를 바꾸면 다시 불러온다.
// 동의 여부는 여기서 보지 않는다. 이 화면은 keep-alive가 아니라서 마이페이지에서
// 동의를 켜고 돌아오면 어차피 새로 mount되고, 아래 onMounted가 최신 프로필로 다시 조회한다.
// 여기에 hasCompareConsent를 같이 걸면 프로필이 도착하는 순간 watch와 onMounted가
// 함께 발동해 같은 요청이 두 번 나간다.
watch([assetRange, ageRange], fetchComparison)

onMounted(async () => {
  // 새로고침으로 들어오면 프로필이 비어 있어 동의 여부를 알 수 없다.
  // 마이페이지를 거쳐 왔다면 이미 채워져 있으므로 다시 부르지 않는다.
  if (!memberStore.profile) {
    await memberStore.fetchProfile()
  }
  fetchComparison()
})
</script>

<template>
  <div class="compare-view">
    <header class="compare-view__header">
      <h1>또래 비교</h1>
      <p v-if="snapshotLabel">집계 기준 {{ snapshotLabel }} · 매월 1일 갱신</p>
      <span v-if="isSnapshotStale" class="compare-view__stale">
        {{ snapshotLabel }} 기준 · 2주 이상 지난 집계
      </span>
    </header>

    <div class="compare-view__body">
      <p v-if="status === 'loading'" class="compare-view__notice">불러오는 중...</p>

      <p v-else-if="status === 'error'" class="compare-view__notice">
        비교 결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
      </p>

      <CompareLockedCard v-else-if="status === 'no-consent'" />

      <div v-else-if="status === 'no-snapshot'" class="state-card">
        <span class="state-card__eyebrow">목표 미설정</span>
        <p class="state-card__title">아직 비교할 내 목표가 없어요</p>
        <p class="state-card__body">목표를 설정하면 바로 또래와 비교해서 보여드려요.</p>
        <RouterLink class="state-card__cta" to="/diagnosis">목표 설정하러 가기</RouterLink>
      </div>

      <div v-else-if="status === 'no-asset'" class="state-card">
        <span class="state-card__eyebrow state-card__eyebrow--wait">자산 연동 필요</span>
        <p class="state-card__title">자산을 연동하면 비교해드릴게요</p>
        <p class="state-card__body">
          또래 비교는 순자산이 비슷한 사람끼리 묶어서 보여드려요.<br />
          자산을 연동하면 바로 결과를 볼 수 있어요.
        </p>
        <RouterLink class="state-card__cta" to="/asset-link">자산 연동하러 가기</RouterLink>
      </div>

      <div v-else-if="status === 'insufficient'" class="state-card">
        <span class="state-card__eyebrow">집계 대기</span>
        <p class="state-card__title">아직 비교 데이터가 부족합니다</p>
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

        <!--
          이 화면에는 CohortConditionCard가 없어서 범위를 넓힐 길이 여기밖에 없다.
          기본값(±1,000만/±2세)으로 인원이 안 차면 넓히면 채워지는 경우가 많은데,
          버튼이 없으면 넓힐 수 있다는 것 자체를 모르고 나가게 된다.
        -->
        <button
          v-if="canWidenCohort"
          type="button"
          class="state-card__cta state-card__cta--button"
          @click="isEditOpen = true"
        >
          비교 범위 넓히기
        </button>
        <p v-else class="state-card__hint">
          비교 범위를 가장 넓게 잡아도 아직 또래가 모이지 않았어요.<br />
          조금 뒤에 다시 확인해주세요.
        </p>
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
  </div>
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

/* 집계가 2주 넘게 묵었을 때만 붙는 라벨 */
.compare-view__stale {
  display: inline-flex;
  padding: 2px 9px;
  border-radius: 999px;
  background: rgba(255, 217, 57, 0.16);
  color: #ffd939;
  font-size: 10.5px;
  font-weight: 600;
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

/* 한 단계만 더 하면 되는 상태는 붉은색이 아니라 노란색. 잘못된 게 아니다. */
.state-card__eyebrow--wait {
  background: rgba(255, 217, 57, 0.16);
  color: #ffd939;
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

/* RouterLink가 아니라 button이라 브라우저 기본 스타일을 지워야 모양이 같아진다. */
.state-card__cta--button {
  border: 0;
  font-family: inherit;
  cursor: pointer;
}

.state-card__hint {
  margin: 12px 0 0;
  font-size: 11px;
  line-height: 1.6;
  color: var(--text);
  opacity: 0.75;
}

.state-card__gauge {
  margin-top: 11px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 모서리를 굴리지 않는다. 앱 전체가 각진 픽셀 톤이라 여기만 둥글면 튄다. (SavingRangeCard와 같은 규칙) */
.state-card__gauge-track {
  flex: 1;
  height: 6px;
  background: var(--border);
  overflow: hidden;
}

.state-card__gauge-fill {
  display: block;
  height: 100%;
  background: var(--color-point);
}

.state-card__gauge-label {
  font-size: 10.5px;
  color: var(--text);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
</style>
