<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import { formatManwon } from '@/shared/utils/formatter'

import { useMemberStore } from '@/features/member/store/memberStore'

import { useAssetComparison } from '@/features/compare/composables/useAssetComparison'
import {
  filterEligibleCohortTypes,
  useCohortFilter,
} from '@/features/compare/composables/useCohortFilter'
import { useGoalComparison } from '@/features/compare/composables/useGoalComparison'
import AchievementHistogramCard from '@/features/compare/components/AchievementHistogramCard.vue'
import CohortConditionCard from '@/features/compare/components/CohortConditionCard.vue'
import CohortEditSheet from '@/features/compare/components/CohortEditSheet.vue'
import CohortInsufficientNotice from '@/features/compare/components/CohortInsufficientNotice.vue'
import CompareLockedCard from '@/features/compare/components/CompareLockedCard.vue'
import CompareTabs from '@/features/compare/components/CompareTabs.vue'
import DealTypeDistributionCard from '@/features/compare/components/DealTypeDistributionCard.vue'
import IncomeBracketDistributionCard from '@/features/compare/components/IncomeBracketDistributionCard.vue'
import NetAssetHighlightCard from '@/features/compare/components/NetAssetHighlightCard.vue'
import OccupationDistributionCard from '@/features/compare/components/OccupationDistributionCard.vue'
import PopularRegionsCard from '@/features/compare/components/PopularRegionsCard.vue'
import SavingRangeCard from '@/features/compare/components/SavingRangeCard.vue'
import StateNoticeCard from '@/features/compare/components/StateNoticeCard.vue'

import lockImage from '@/features/compare/assets/lock.png'

// '또래 비교 데이터 제공' 약관 동의 여부. 회원가입·마이페이지 토글에서 정해진다.
// 값을 모르면 동의 안 한 것으로 본다. 개인정보라 열어두는 쪽으로 기울면 안 된다.
const memberStore = useMemberStore()
const hasCompareConsent = computed(() => memberStore.profile?.compareDataAgreed ?? false)

// cohortTypes 필터는 해당 정보를 등록한 사용자만 쓸 수 있다(COMPARE_INCOME_REQUIRED 등).
const hasIncomeInfo = computed(() => memberStore.profile?.monthlyIncome != null)
const hasOccupationInfo = computed(() => memberStore.profile?.occupationType != null)

const { assetRange, ageRange, cohortTypes, canWidenCohort, applyCohort } = useCohortFilter()

/**
 * 예전에 저장해둔 필터가 남아있거나, 정보 등록 전에 시트를 거치지 않고도
 * 요청이 나갈 수 있어(첫 진입 등) 실제 전송 직전에 한 번 더 걸러낸다.
 */
const eligibleCohortTypes = computed(() =>
  filterEligibleCohortTypes(cohortTypes.value, {
    hasIncomeInfo: hasIncomeInfo.value,
    hasOccupationInfo: hasOccupationInfo.value,
  }),
)

const {
  status: goalStatus,
  comparison: goalComparison,
  errorMessage: goalErrorMessage,
  fetch: fetchGoalComparison,
} = useGoalComparison()

const {
  status: assetStatus,
  comparison: assetComparison,
  errorMessage: assetErrorMessage,
  fetch: fetchAssetComparison,
} = useAssetComparison()

const isEditOpen = ref(false)
const hasLoadedOnce = ref(false)
const activeTab = ref('asset') // 'asset' | 'goal'
let hasUserPickedTab = false

function selectTab(tab) {
  hasUserPickedTab = true
  activeTab.value = tab
}

/** 목표 자체가 없어서 잠긴 상태인지. 자산 미연동·인원 미달 등 다른 실패는 각 탭 안에서 따로 보여준다. */
const isGoalLocked = computed(() => goalStatus.value === 'no-snapshot')

const activeComparison = computed(() =>
  activeTab.value === 'goal' ? goalComparison.value : assetComparison.value,
)
const activeStatus = computed(() =>
  activeTab.value === 'goal' ? goalStatus.value : assetStatus.value,
)
const activeErrorMessage = computed(() =>
  activeTab.value === 'goal' ? goalErrorMessage.value : assetErrorMessage.value,
)

/** snapshotYm('202607')에서 숫자만 뽑는다. 라벨 계산과 오래됨 판정이 둘 다 이 값을 쓴다. */
const snapshotDigits = computed(() =>
  String(activeComparison.value?.snapshotYm ?? '').replace(/\D/g, ''),
)

/** 응답의 snapshotYm을 '2026.07.01'로 바꾼다. 집계는 매월 1일 기준이다. */
const snapshotLabel = computed(() => {
  const digits = snapshotDigits.value
  return digits.length >= 6 ? `${digits.slice(0, 4)}.${digits.slice(4, 6)}.01` : ''
})

/**
 * 집계 기준일이 오래됐는지. 기능명세서 예외 흐름:
 *   "배치 지연 → 마지막 집계 기준일 표시 / 집계 기준일 2주 초과 → 기준일 라벨 표시"
 */
const STALE_DAYS = 14
const isSnapshotStale = computed(() => {
  const digits = snapshotDigits.value
  if (digits.length < 6) return false
  const base = new Date(Number(digits.slice(0, 4)), Number(digits.slice(4, 6)) - 1, 1)
  return (Date.now() - base.getTime()) / 86_400_000 > STALE_DAYS
})

async function fetchAll() {
  // 어차피 거절당할 요청이므로 보내지 않는다.
  if (!hasCompareConsent.value) {
    goalStatus.value = 'no-consent'
    assetStatus.value = 'no-consent'
    hasLoadedOnce.value = true
    return
  }

  const params = {
    assetRange: assetRange.value,
    ageRange: ageRange.value,
    cohortTypes: eligibleCohortTypes.value,
  }
  await Promise.all([fetchGoalComparison(params), fetchAssetComparison(params)])
  hasLoadedOnce.value = true

  // 사용자가 아직 탭을 직접 고른 적 없으면 목표 유무로 기본 탭을 정한다.
  if (!hasUserPickedTab) {
    activeTab.value =
      goalStatus.value === 'ready' || goalStatus.value === 'insufficient' ? 'goal' : 'asset'
  }
}

function handleApplyCohort(next) {
  isEditOpen.value = false
  // 값이 바뀌면 아래 watch가 두 탭을 함께 재조회한다.
  applyCohort(next)
}

// 비교 범위/필터를 바꾸면 두 탭 모두 다시 불러온다.
// 동의 여부는 여기서 보지 않는다. 이 화면은 keep-alive가 아니라서 마이페이지에서
// 동의를 켜고 돌아오면 어차피 새로 mount되고, 아래 onMounted가 최신 프로필로 다시 조회한다.
watch([assetRange, ageRange, cohortTypes], fetchAll)

onMounted(async () => {
  // 새로고침으로 들어오면 프로필이 비어 있어 동의 여부를 알 수 없다.
  // 마이페이지를 거쳐 왔다면 이미 채워져 있으므로 다시 부르지 않는다.
  if (!memberStore.profile) {
    await memberStore.fetchProfile()
  }
  fetchAll()
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

    <p v-if="!hasLoadedOnce" class="compare-view__notice">불러오는 중...</p>

    <CompareLockedCard v-else-if="goalStatus === 'no-consent'" />

    <template v-else>
      <CompareTabs :active-tab="activeTab" :goal-locked="isGoalLocked" @select="selectTab" />

      <div class="compare-view__body">
        <!-- 목표 자체가 없어서 잠긴 상태(목표 탭 전용). 그 외 상태는 두 탭이 같은 마크업을 공유한다. -->
        <StateNoticeCard
          v-if="activeTab === 'goal' && isGoalLocked"
          eyebrow="목표 비교 잠금"
          variant="wait"
          title="목표를 세우면 달성률과 저축 순위를 볼 수 있어요"
        >
          비슷한 자산의 또래들과 목표 달성률, 저축 구간 순위를 비교해드려요.<br />
          지금 목표를 설정하면 바로 확인할 수 있어요.
          <template #action>
            <RouterLink class="state-card__cta" to="/diagnosis">목표 설정하러 가기</RouterLink>
          </template>
        </StateNoticeCard>

        <p v-else-if="activeStatus === 'loading'" class="compare-view__notice">불러오는 중...</p>

        <p v-else-if="activeStatus === 'error'" class="compare-view__notice">
          {{ activeErrorMessage || '비교 결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요.' }}
        </p>

        <StateNoticeCard
          v-else-if="activeStatus === 'no-asset'"
          eyebrow="자산 연동 필요"
          variant="wait"
          title="자산을 연동하면 비교해드릴게요"
        >
          또래 비교는 순자산이 비슷한 사람끼리 묶어서 보여드려요.<br />
          자산을 연동하면 바로 결과를 볼 수 있어요.
          <template #action>
            <RouterLink class="state-card__cta" to="/asset-link">자산 연동하러 가기</RouterLink>
          </template>
        </StateNoticeCard>

        <CohortInsufficientNotice
          v-else-if="activeStatus === 'insufficient' && activeComparison"
          :cohort-size="activeComparison.cohort.cohortSize"
          :minimum-required="activeComparison.cohort.minimumRequired"
          :can-widen="canWidenCohort"
          @widen="isEditOpen = true"
        />

        <template v-else-if="activeStatus === 'ready' && activeComparison">
          <CohortConditionCard
            :cohort-size="activeComparison.cohort.cohortSize"
            :asset-range-label="`자산 ±${formatManwon(activeComparison.cohort.assetRange)}`"
            :age-range-label="`나이 ±${activeComparison.cohort.ageRange}세`"
            @edit="isEditOpen = true"
          />

          <template v-if="activeTab === 'asset'">
            <NetAssetHighlightCard
              :cohort-average-net-assets="activeComparison.cohortAverageNetAssets"
            />

            <IncomeBracketDistributionCard
              :brackets="activeComparison.incomeBracketDistribution"
              :my-monthly-income="activeComparison.myMonthlyIncome"
            />

            <OccupationDistributionCard :items="activeComparison.occupationDistribution" />

            <SavingRangeCard
              v-if="activeComparison.saving?.mine != null"
              :my-monthly-saving="activeComparison.saving.mine"
              :cohort-range-min="activeComparison.saving.cohortMin"
              :cohort-range-max="activeComparison.saving.cohortMax"
            />
            <StateNoticeCard
              v-else
              eyebrow="목표 설정 필요"
              variant="wait"
              title="목표를 세우면 저축 계획도 비교할 수 있어요"
            >
              어떤 목표로 얼마씩 모으고 있는지 또래와 비교해보세요.
              <template #action>
                <RouterLink class="state-card__cta" to="/diagnosis">목표 설정하러 가기</RouterLink>
              </template>
            </StateNoticeCard>
          </template>

          <template v-else>
            <AchievementHistogramCard
              :my-rate="activeComparison.achievement.mine"
              :cohort-average-rate="activeComparison.achievement.cohortAverage"
              :buckets="activeComparison.achievement.buckets"
            />

            <div class="stat-pair">
              <div class="stat-card">
                <div class="stat-card__label">평균 목표 자산</div>
                <div class="stat-card__value">
                  {{ formatManwon(activeComparison.averageTargetAmount) }}
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-card__label">평균 준비 기간</div>
                <div class="stat-card__value">{{ activeComparison.averagePrepMonths }}개월</div>
              </div>
            </div>

            <DealTypeDistributionCard
              :top-deal-type="activeComparison.dealTypeDistribution[0].label"
              :top-deal-ratio="activeComparison.dealTypeDistribution[0].ratio"
              :items="activeComparison.dealTypeDistribution"
            />

            <PopularRegionsCard :regions="activeComparison.popularRegions" />
          </template>

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
    </template>

    <!-- 열 때마다 새로 만들어야 사본(draft)이 현재 값으로 초기화된다. -->
    <CohortEditSheet
      v-if="isEditOpen"
      :asset-range="assetRange"
      :age-range="ageRange"
      :cohort-types="cohortTypes"
      :has-income-info="hasIncomeInfo"
      :has-occupation-info="hasOccupationInfo"
      @apply="handleApplyCohort"
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
  margin-top: 10px;
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

/* CohortInsufficientNotice/StateNoticeCard의 action 슬롯으로 넘기는 CTA.
   슬롯 콘텐츠는 이 컴포넌트 템플릿에 쓰여 있어 scoped 스타일이 그대로 적용된다. */
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
</style>
