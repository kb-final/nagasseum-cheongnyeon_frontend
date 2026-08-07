import { formatAreaRange } from '@/shared/utils/formatter'
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
    changeAmount: marketTrend.changeAmount,
    targetAmount: marketTrend.targetAmount,
    initialMiddleAmount: marketTrend.initialMiddleAmount,
    currentMiddleAmount: marketTrend.currentMiddleAmount,
    maintainEta: marketTrend.maintainEta,
    reflectEta: marketTrend.reflectEta,
  }
}
