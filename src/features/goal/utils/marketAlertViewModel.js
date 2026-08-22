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
// predictionChangeAmount = latestPredictedMarketAmount - initialMiddleAmount를 백엔드가 이미
// 계산해서 내려준다(목표 상세 화면의 MarketPriceAlertCard와 같은 값). 최신 몬테카를로 예측을
// 만들 수 없으면(latestPredictedMarketAmount 계산 실패) null로 내려오고, 그 경우 이 줄을 숨긴다.
export function toHomeMarketPriceChangeLabel(marketAlert) {
  if (!marketAlert) return null

  const { predictionChangeAmount } = marketAlert
  if (predictionChangeAmount == null || predictionChangeAmount === 0) return null

  const isUp = predictionChangeAmount > 0
  const emphasis = `${formatEokManwon(Math.abs(predictionChangeAmount))} ${isUp ? '늘어났어요' : '줄었어요'}`
  // 매물 시세 변화 카드(MarketPriceAlertCard)와 같은 색 규칙: 오르면(매수자에게 불리) 빨강,
  // 내리면(매수자에게 유리) 초록으로 강조한다.
  return { prefix: '진단 당시보다 예측 시세가 ', emphasis, direction: isUp ? 'up' : 'down' }
}
