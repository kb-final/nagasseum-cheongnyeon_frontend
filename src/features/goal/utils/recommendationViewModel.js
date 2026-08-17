import {
  formatAreaRangeM2,
  formatGoalAmount,
  formatYearMonth,
  formatMonthsToYearsKo,
  m2ToPyeong,
} from '@/shared/utils/formatter'
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

// 상세 화면 상단 한 줄 설명. REALISTIC만 문구가 확정돼 있고, 나머지 type은 아직 확정 전이라
// API가 내려주는 reason을 그대로 대체 문구로 쓴다(화면이 비어 보이지 않도록).
const RECOMMENDATION_DESCRIPTION_MAP = {
  REALISTIC: '목표 시점은 유지하면서 현재 상황에 맞는 주거 조건을 찾았어요.',
}

// "이 계획의 기준" 카드의 2행. REALISTIC만 확정. 매핑이 없는 type은 빈 배열을 돌려주고,
// 카드 쪽에서 rows가 비어 있으면 카드 자체를 렌더링하지 않는다(틀릴 수 있는 문구를 지어내지 않음).
const RECOMMENDATION_BASIS_MAP = {
  REALISTIC: [
    { label: '목표 시점', value: '그대로 유지' },
    { label: '주거 조건', value: '현재 상황에 맞게 조정' },
  ],
}

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

// 상세 화면 상단 설명 한 줄
export function toRecommendationDescription(recommendation) {
  return RECOMMENDATION_DESCRIPTION_MAP[recommendation.type] ?? recommendation.reason
}

// "이 계획의 기준" 카드 rows. 빈 배열이면 호출부가 카드를 숨긴다.
export function toRecommendationBasisRows(recommendation) {
  return RECOMMENDATION_BASIS_MAP[recommendation.type] ?? []
}

// 상세 화면 "주거 조건" 카드용. 목록 카드(toConditionTitle)와 달리 지역명을 독립된 줄로 강조하고
// 유형·거래는 별도 줄로 낮춰 보여줘야 해서 별도로 조합한다.
export function toHousingViewModel(condition) {
  return {
    regionName: condition.regionName,
    typeLine: [
      HOUSING_TYPE_LABEL[condition.housingType] ?? condition.housingType,
      DEAL_TYPE_LABEL[condition.dealType] ?? condition.dealType,
    ].join(' · '),
    areaLine: toConditionArea(condition),
    sampleCountLabel:
      condition.sampleCount > 0
        ? `실거래 ${condition.sampleCount.toLocaleString('ko-KR')}건을 기준으로 계산했어요.`
        : null,
  }
}

// 상세 화면 "이 목표를 준비하려면" 카드용. loanO가 없는 recommendation이 향후 있을 수 있어
// withLoan을 null로 돌려주면 호출부가 그 section을 통째로 렌더링하지 않는다.
export function toFundingViewModel({ loanX, loanO }) {
  return {
    withoutLoan: {
      targetAmountLabel: formatGoalAmount(loanX.targetAmount),
      targetDateLabel: formatYearMonth(loanX.targetDate),
      monthlySavingLabel: formatGoalAmount(loanX.monthlySaving),
    },
    withLoan: loanO
      ? {
          loanAmountLabel: formatGoalAmount(loanO.loanAmount),
          targetAmountLabel: formatGoalAmount(loanO.targetAmount),
          targetDateLabel: formatYearMonth(loanO.targetDate),
          monthlySavingLabel: formatGoalAmount(loanO.monthlySaving),
          shortenedLabel:
            typeof loanO.shortenedMonths === 'number'
              ? formatMonthsToYearsKo(loanO.shortenedMonths)
              : null,
        }
      : null,
  }
}

// "이 계획으로 목표 설정하기" 저장 payload(goalApi.postGoal 기대 형태)로 매핑한다.
// recommendation 응답과 저장 요청 스키마가 완전히 같지 않아 아래는 최선 추정 근사치다
// (계획서에서 사용자와 합의한 매핑 — 백엔드 계약이 확정되면 이 함수만 고치면 된다):
// - sizeMin/sizeMax: condition.areaMin/Max(㎡)를 평으로 반올림 환산
// - depositMin/depositMax: recommendation에 없는 값이라 "조건 미지정" 컨벤션대로 null
// - monthlyRentMin/monthlyRentMax: 범위가 아니라 단일값(monthlyRent)이라 WOLSE면 그 값을
//   min=max로 두는 점(point) 근사, JEONSE면 null
// - targetDate/targetAmount: 대출 미가정 기준(loanX)으로 통일
// - targetRentMiddleAmount: recommendation에 시세 중앙값 필드 자체가 없어 지어내지 않고 null
export function toGoalCreationPayload(recommendation) {
  const { condition, loanX } = recommendation
  const isWolse = condition.dealType === 'WOLSE' && condition.monthlyRent > 0

  return {
    regionCode: condition.regionCode,
    propertyType: condition.housingType,
    tradeType: condition.dealType,
    sizeMin: m2ToPyeong(condition.areaMin),
    sizeMax: m2ToPyeong(condition.areaMax),
    depositMin: null,
    depositMax: null,
    monthlyRentMin: isWolse ? condition.monthlyRent : null,
    monthlyRentMax: isWolse ? condition.monthlyRent : null,
    targetDate: loanX.targetDate,
    targetAmount: loanX.targetAmount,
    targetRentMiddleAmount: null,
    monthlySavings: loanX.monthlySaving,
  }
}
