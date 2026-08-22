import { ref } from 'vue'
import { defineStore } from 'pinia'

import { HOUSING_TYPE_LABEL, DEAL_TYPE_LABEL } from '@/shared/constants/housing'

import {
  fetchGoalSummary,
  fetchGoalMarketTrend,
  fetchCurrentSaving,
  putCurrentSaving,
} from '@/features/goal/api/goalApi'
import { getAssetSummary } from '@/features/asset/api/assetApi'
import {
  toMarketAlertViewModel,
  toHomeMarketPriceChangeLabel,
} from '@/features/goal/utils/marketAlertViewModel'

// 레벨/알림 배지는 홈 화면 API 명세(목표 요약 · 자산 요약) 어디에도 없는 항목이라
// 연동할 API가 아직 없다. 화면 골격을 채우기 위한 임시 표시값.
const PLACEHOLDER_MEMBER_BADGE = {
  nickname: '민지',
  level: 3,
  levelTitle: '등반가',
  hasUnreadNotification: true,
}

// GET /goals/savings/current 조회가 실패했을 때(활성 목표 없음 등) 카드가 기대하는 기본 모양.
// recorded:false가 기준이라 targetSaving/actualSaving 값을 임의로 지어내지 않는다.
const EMPTY_SAVING_RECORD = {
  recordYm: null,
  targetSaving: 0,
  actualSaving: null,
  recorded: false,
  differenceAmount: null,
}

// GET /goals/summary 응답 -> ClimbProgressCard/ActiveGoalCard가 쓰는 goal 뷰모델
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

// GET /goals/summary 응답 -> ClimbProgressCard/ActiveGoalCard가 쓰는 climb(달성률) 뷰모델
function toClimbViewModel(goalSummary) {
  return {
    progressPercent: Math.round(goalSummary.progress.achievementRate),
    currentAmount: goalSummary.progress.currentAmount,
    remainingAmount: goalSummary.progress.remainingAmount,
    // 최근 자산 증가액은 이번 API 명세에 없는 지표라 임시로 0 처리
    recentIncreaseAmount: 0,
  }
}

// GET /assets/summary 응답 -> TotalAssetCard의 예적금/대출 row가 쓰는 assetBreakdown 뷰모델
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
  const assetSummary = ref(null)
  const assetBreakdown = ref(null)
  // 현재 목표 카드의 "최근 OO 시세 상승/하락으로 예상 시점 +N개월" 한 줄. 목표 상세 화면의
  // 매물 시세 변화 카드와 같은 API(GET /goals/market-trend)를 홈에서도 그대로 재사용한다.
  const marketInsight = ref(null)
  // 이번 달 저축 기록(GET /goals/savings/current) 원본 응답 그대로 보관한다.
  // recorded로 입력 여부를 가르고, success:true인 이상 recorded:false는 오류가 아니다.
  const currentSavingRecord = ref(EMPTY_SAVING_RECORD)
  const isLoading = ref(false)
  const loaded = ref(false)
  const isSavingCurrentSaving = ref(false)
  const savingError = ref(null)

  async function loadSummary() {
    isLoading.value = true

    // 네 API는 서로 독립적이라, 하나가 실패(예: 활성 목표 없음, 자산 미연동, 시세 데이터 없음)
    // 해도 나머지 카드는 그대로 보여준다.
    const [goalSummaryResult, assetSummaryResult, marketTrendResult, currentSavingResult] =
      await Promise.allSettled([
        fetchGoalSummary(),
        getAssetSummary(),
        fetchGoalMarketTrend(),
        fetchCurrentSaving(),
      ])

    if (goalSummaryResult.status === 'fulfilled') {
      goal.value = toGoalViewModel(goalSummaryResult.value)
      climb.value = toClimbViewModel(goalSummaryResult.value)
    } else {
      goal.value = null
      climb.value = null
    }

    if (assetSummaryResult.status === 'fulfilled') {
      const raw = assetSummaryResult.value
      assetSummary.value = raw
      assetBreakdown.value = toAssetBreakdownViewModel(raw)
    } else {
      // 자산 미연동(ASSET_006) 등으로 실패하면 자산 카드 자리에 연동 유도 카드를 대신 보여준다.
      assetSummary.value = null
      assetBreakdown.value = null
    }

    marketInsight.value =
      marketTrendResult.status === 'fulfilled'
        ? toHomeMarketPriceChangeLabel(toMarketAlertViewModel(marketTrendResult.value))
        : null

    currentSavingRecord.value =
      currentSavingResult.status === 'fulfilled' ? currentSavingResult.value : EMPTY_SAVING_RECORD

    isLoading.value = false
    loaded.value = true
  }

  // 이번 달 실제 저축액을 입력/수정한다. 성공하면 홈 데이터를 통째로 다시 부르지 않고
  // PUT 응답으로 currentSavingRecord만 즉시 갱신해서 카드가 바로 입력 완료 상태로 바뀌게 한다.
  async function saveCurrentSaving(actualSaving) {
    isSavingCurrentSaving.value = true
    savingError.value = null
    try {
      currentSavingRecord.value = await putCurrentSaving(actualSaving)
      return true
    } catch (e) {
      savingError.value = e
      return false
    } finally {
      isSavingCurrentSaving.value = false
    }
  }

  return {
    member,
    goal,
    climb,
    assetSummary,
    assetBreakdown,
    marketInsight,
    currentSavingRecord,
    isLoading,
    loaded,
    isSavingCurrentSaving,
    savingError,
    loadSummary,
    saveCurrentSaving,
  }
})
