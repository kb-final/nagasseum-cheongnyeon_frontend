import { ref } from 'vue'
import { defineStore } from 'pinia'

import { formatAreaRange } from '@/shared/utils/formatter'
import { HOUSING_TYPE_LABEL, DEAL_TYPE_LABEL } from '@/shared/constants/housing'

import { fetchGoalMarketTrend, fetchGoalSummary } from '@/features/goal/api/goalApi'
import { getAssetSummary } from '@/features/asset/api/assetApi'
import { fetchRecommendedPolicies } from '@/features/home/api/homeApi'

// 레벨/알림 배지는 홈 화면 API 명세(목표 요약 · 매물 시세 변화 · 자산 요약) 어디에도 없는 항목이라
// 연동할 API가 아직 없다. 화면 골격을 채우기 위한 임시 표시값.
const PLACEHOLDER_MEMBER_BADGE = {
  nickname: '민지',
  level: 3,
  levelTitle: '등반가',
  hasUnreadNotification: true,
}

// GET /goals/summary 응답 -> ClimbProgressCard/EmptyGoalCard가 쓰는 goal 뷰모델
function toGoalViewModel(goalSummary) {
  return {
    id: goalSummary.goalId,
    housingType:
      HOUSING_TYPE_LABEL[goalSummary.housing.housingType] ?? goalSummary.housing.housingType,
    dealType: DEAL_TYPE_LABEL[goalSummary.housing.dealType] ?? goalSummary.housing.dealType,
    regionName: goalSummary.housing.regionName,
    targetAmount: goalSummary.targetAmount,
    targetDate: goalSummary.targetDate,
  }
}

// GET /goals/summary 응답 -> ClimbProgressCard가 쓰는 climb(달성률) 뷰모델
function toClimbViewModel(goalSummary) {
  return {
    progressPercent: Math.round(goalSummary.progress.achievementRate),
    remainingAmount: goalSummary.progress.remainingAmount,
    // 최근 자산 증가액은 이번 API 명세에 없는 지표라 임시로 0 처리
    recentIncreaseAmount: 0,
  }
}

// GET /goals/market-trend 응답 -> MarketPriceAlertCard가 쓰는 marketAlert 뷰모델
function toMarketAlertViewModel(marketTrend) {
  return {
    regionName: marketTrend.regionName,
    housingType: HOUSING_TYPE_LABEL[marketTrend.housingType] ?? marketTrend.housingType,
    dealType: DEAL_TYPE_LABEL[marketTrend.dealType] ?? marketTrend.dealType,
    areaLabel: formatAreaRange(marketTrend.areaMin, marketTrend.areaMax),
    updatedYm: marketTrend.updatedYm,
    changeAmount: marketTrend.changeAmount,
    targetAmount: marketTrend.targetAmount,
    initialMiddleAmount: marketTrend.initialMiddleAmount,
    currentMiddleAmount: marketTrend.currentMiddleAmount,
    maintainEta: marketTrend.maintainEta,
    reflectEta: marketTrend.reflectEta,
  }
}

// GET /assets/summary 응답 -> AssetSummaryGrid가 쓰는 assetBreakdown 뷰모델
// (loans는 assetBreakdown이 아니라 응답 최상단에 있어 별도로 옮겨준다)
function toAssetBreakdownViewModel(assetSummary) {
  return {
    depositSavings: {
      totalAmount: assetSummary.assetBreakdown.cashAssets.total,
      accountCount: assetSummary.assetBreakdown.cashAssets.accounts.length,
    },
    loan: {
      accountCount: assetSummary.loans.length,
    },
  }
}

export const useHomeStore = defineStore('home', () => {
  const member = ref(PLACEHOLDER_MEMBER_BADGE)
  const goal = ref(null)
  const climb = ref(null)
  const marketAlert = ref(null)
  const assetSummary = ref(null)
  const assetBreakdown = ref(null)
  const recommendedPolicies = ref([])
  const isLoading = ref(false)
  const loaded = ref(false)

  async function loadSummary() {
    isLoading.value = true

    // 네 API는 서로 독립적이라, 하나가 실패(예: 활성 목표 없음, 자산 미연동)해도 나머지 카드는 그대로 보여준다.
    const [goalSummaryResult, marketTrendResult, assetSummaryResult, policiesResult] =
      await Promise.allSettled([
        fetchGoalSummary(),
        fetchGoalMarketTrend(),
        getAssetSummary(),
        fetchRecommendedPolicies(),
      ])

    if (goalSummaryResult.status === 'fulfilled') {
      goal.value = toGoalViewModel(goalSummaryResult.value)
      climb.value = toClimbViewModel(goalSummaryResult.value)
    } else {
      goal.value = null
      climb.value = null
    }

    marketAlert.value =
      marketTrendResult.status === 'fulfilled'
        ? toMarketAlertViewModel(marketTrendResult.value)
        : null

    if (assetSummaryResult.status === 'fulfilled') {
      const raw = assetSummaryResult.value
      assetSummary.value = raw
      assetBreakdown.value = toAssetBreakdownViewModel(raw)
    } else {
      // 자산 미연동(ASSET_006) 등으로 실패하면 자산 카드 자리에 연동 유도 카드를 대신 보여준다.
      assetSummary.value = null
      assetBreakdown.value = null
    }

    recommendedPolicies.value = policiesResult.status === 'fulfilled' ? policiesResult.value : []

    isLoading.value = false
    loaded.value = true
  }

  return {
    member,
    goal,
    climb,
    marketAlert,
    assetSummary,
    assetBreakdown,
    recommendedPolicies,
    isLoading,
    loaded,
    loadSummary,
  }
})
