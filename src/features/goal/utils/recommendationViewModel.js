import { formatAreaRangeM2, formatGoalAmount, formatYearMonth } from '@/shared/utils/formatter'
import { HOUSING_TYPE_LABEL, DEAL_TYPE_LABEL } from '@/shared/constants/housing'

// 진단 결과 화면(추천 계획 비교 리스트)의 카드 정렬 순서. API 배열 순서를 그대로 믿지 않고
// 항상 이 순서로 재정렬한다. 목록에 없는(향후 추가될) type은 정의된 type들 뒤에 붙인다.
const TYPE_ORDER = {
  PREFERENCE: 0,
  REALISTIC: 1,
  HOLD_OUT: 2,
}

// API의 title을 그대로 쓰지 않고 화면 전용 제목으로 바꾼다.
export const RECOMMENDATION_TITLE_MAP = {
  PREFERENCE: '희망 조건 기준 계획',
  REALISTIC: '목표 시점에 맞춘 계획',
  HOLD_OUT: '주거 조건을 유지한 계획',
}

// 제목 아래 한 줄로 각 계획이 어떤 기준으로 만들어졌는지 보여준다.
export const RECOMMENDATION_STRATEGY_MAP = {
  PREFERENCE: '희망 조건 중심 · 조건 유연 구성',
  REALISTIC: '목표 시점 유지 · 주거 조건 조정',
  HOLD_OUT: '주거 조건 유지 · 준비 기간 연장',
}

// type마다 loanX.targetDate가 의미하는 바가 달라, 라벨도 다르게 보여준다.
const TARGET_DATE_LABEL_MAP = {
  PREFERENCE: '예상 도달 시점',
  REALISTIC: '목표 시점',
  HOLD_OUT: '예상 도달 시점',
}

// 정의되지 않은 type이 오더라도 화면이 깨지지 않도록 기본값을 둔다.
const DEFAULT_TARGET_DATE_LABEL = '예상 도달 시점'

// API 배열을 화면에 표시할 순서로 정렬한다. 정의된 type 우선순위 뒤로는 원래 순서를 유지한다.
export function sortRecommendations(recommendations) {
  return [...(recommendations ?? [])].sort(
    (a, b) =>
      (TYPE_ORDER[a.type] ?? Number.MAX_SAFE_INTEGER) -
      (TYPE_ORDER[b.type] ?? Number.MAX_SAFE_INTEGER),
  )
}

// "서울 마포구 · 아파트 · 전세"
function toConditionTitle(condition) {
  return [
    condition.regionName,
    HOUSING_TYPE_LABEL[condition.housingType] ?? condition.housingType,
    DEAL_TYPE_LABEL[condition.dealType] ?? condition.dealType,
  ]
    .filter(Boolean)
    .join(' · ')
}

// "전용 33~66㎡" (월세면서 실제 월세액이 있으면 "· 월 60만 원"을 이어붙인다)
function toConditionArea(condition) {
  const areaLabel = formatAreaRangeM2(condition.areaMin, condition.areaMax)

  if (condition.dealType === 'WOLSE' && condition.monthlyRent > 0) {
    return `${areaLabel} · 월 ${formatGoalAmount(condition.monthlyRent)}`
  }
  return areaLabel
}

// recommendation 원본 응답을 RecommendationCard가 그대로 그릴 수 있는 표시용 값으로 변환한다.
export function toRecommendationViewModel(recommendation) {
  const { type, condition, loanX } = recommendation

  return {
    type,
    title: RECOMMENDATION_TITLE_MAP[type] ?? recommendation.title,
    strategy: RECOMMENDATION_STRATEGY_MAP[type] ?? '',
    conditionTitle: toConditionTitle(condition),
    conditionArea: toConditionArea(condition),
    targetAmountLabel: formatGoalAmount(loanX.targetAmount),
    targetDateFieldLabel: TARGET_DATE_LABEL_MAP[type] ?? DEFAULT_TARGET_DATE_LABEL,
    targetDateLabel: formatYearMonth(loanX.targetDate),
  }
}
