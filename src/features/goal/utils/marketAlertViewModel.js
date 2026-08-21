import { formatAreaRange, formatEokManwon } from '@/shared/utils/formatter'
import { HOUSING_TYPE_LABEL, DEAL_TYPE_LABEL } from '@/shared/constants/housing'

// GET /goals/market-trend 응답 -> MarketPriceAlertCard가 쓰는 marketAlert 뷰모델
// 홈 화면과 목표 상세 화면 양쪽에서 같은 카드를 재사용하므로 변환 로직을 공용으로 둔다.
export function toMarketAlertViewModel(marketTrend) {
  return {
    regionName: marketTrend.regionName,
    housingType: HOUSING_TYPE_LABEL[marketTrend.housingType] ?? marketTrend.housingType,
    dealType: DEAL_TYPE_LABEL[marketTrend.dealType] ?? marketTrend.dealType,
    areaLabel: formatAreaRange(marketTrend.areaMin, marketTrend.areaMax),
    updatedYm: marketTrend.updatedYm,
    currentMiddleAmount: marketTrend.currentMiddleAmount,
    predictionTargetYm: marketTrend.predictionTargetYm,
    initialMiddleAmount: marketTrend.initialMiddleAmount,
    latestPredictedMarketAmount: marketTrend.latestPredictedMarketAmount,
    predictionChangeAmount: marketTrend.predictionChangeAmount,
    targetAmount: marketTrend.targetAmount,
    maintainEta: marketTrend.maintainEta,
    reflectEta: marketTrend.reflectEta,
  }
}

// 홈 화면 "현재 목표" 카드용 "진단 당시보다 시세가 OO 늘어났어요/줄었어요" 한 줄 insight.
// { prefix, emphasis }로 나눠 돌려주는 이유는 문장 전체가 아니라 실제로 바뀌는 값(emphasis)만
// 강조색으로 보여주기 위함이다 — 호출부가 prefix는 기본 톤, emphasis만 강조색으로 렌더링한다.
//
// initialMiddleAmount는 목표 설정(진단) 당시 실거래 중앙값이고 currentMiddleAmount는 현재
// 실거래 중앙값이라, 예측(latestPredictedMarketAmount/predictionChangeAmount)과 달리 둘 다
// 이미 확정된 실제 값이다 — "반영하면 ~해요"라는 가정이 아니라 이미 일어난 시세 변화를 그대로
// 보여줄 수 있다.
export function toHomeMarketPriceChangeLabel(marketAlert) {
  if (!marketAlert) return null

  const { initialMiddleAmount, currentMiddleAmount } = marketAlert
  if (initialMiddleAmount == null || currentMiddleAmount == null) return null

  const diff = currentMiddleAmount - initialMiddleAmount
  if (diff === 0) return null

  const emphasis = `${formatEokManwon(Math.abs(diff))} ${diff > 0 ? '늘어났어요' : '줄었어요'}`
  return { prefix: '진단 당시보다 시세가 ', emphasis }
}
