import {
  formatAreaRangePyeong,
  formatGoalAmount,
  formatYearMonth,
  formatMonthsToYearsKo,
  monthsBetweenYm,
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

// 상세 화면 상단 한 줄 설명. REALISTIC/PREFERENCE/HOLD_OUT 모두 문구가 확정돼 있고,
// 정의되지 않은 type만 API가 내려주는 reason을 대체 문구로 쓴다(화면이 비어 보이지 않도록).
const RECOMMENDATION_DESCRIPTION_MAP = {
  PREFERENCE: '희망 조건을 중심으로 주거 계획을 구성했어요.',
  REALISTIC: '목표 시점은 유지하면서 현재 상황에 맞는 주거 조건을 찾았어요.',
  HOLD_OUT: '주거 조건은 유지하고 필요한 준비 기간을 계산했어요.',
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

// "전용 15~20평" (월세면서 실제 월세액이 있으면 "· 월 60만 원"을 이어붙인다)
function toConditionArea(condition) {
  const areaLabel = formatAreaRangePyeong(condition.areaMin, condition.areaMax)

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

// 상세 화면 "주거 조건" 카드용. 목록 카드(toConditionTitle)와 달리 지역명을 독립된 줄로 강조하고
// 유형·거래는 별도 줄로 낮춰 보여줘야 해서 별도로 조합한다. marketMedianAmount는 아직 백엔드
// 응답에 없을 수 있어(23번 요구사항) null-safe하게 처리하고, 없으면 호출부가 그 줄을 숨긴다.
export function toHousingViewModel(condition) {
  return {
    regionName: condition.regionName,
    typeLine: [
      HOUSING_TYPE_LABEL[condition.housingType] ?? condition.housingType,
      DEAL_TYPE_LABEL[condition.dealType] ?? condition.dealType,
    ].join(' · '),
    areaLine: toConditionArea(condition),
    marketMedianAmountLabel:
      typeof condition.marketMedianAmount === 'number'
        ? formatGoalAmount(condition.marketMedianAmount)
        : null,
    sampleCountLabel:
      condition.sampleCount > 0
        ? `실거래 ${condition.sampleCount.toLocaleString('ko-KR')}건 기준`
        : null,
  }
}

// 상세 화면 "준비 금액은 이렇게 계산했어요" 카드용. 실거래 중앙값·현재 활용 가능 자금 둘 중
// 하나라도 없으면 계산 근거를 보여줄 수 없으므로 null을 돌려주고, 호출부가 카드 자체를 숨긴다
// (23번 요구사항 — 없는 값으로 지어낸 계산식을 보여주지 않는다).
export function toAmountBreakdownViewModel({
  marketMedianAmount,
  currentAvailableAmount,
  additionalAmount,
}) {
  if (typeof marketMedianAmount !== 'number' || typeof currentAvailableAmount !== 'number') {
    return null
  }

  return {
    marketMedianAmountLabel: formatGoalAmount(marketMedianAmount),
    currentAvailableAmountLabel: formatGoalAmount(currentAvailableAmount),
    additionalAmountLabel: formatGoalAmount(additionalAmount),
  }
}

// 상세 화면 "이 계획의 기준" 영역용. type마다 사용자에게 설명해야 하는 논리가 달라
// title/description/rows/timeline 중 필요한 조합만 채워 돌려준다. 정의되지 않은 type은
// rows/timeline 없이 API의 reason만 보여준다(문구를 지어내지 않음).
//
// - PREFERENCE: 설명 문장만 (희망 조건을 그대로 반영했다는 논리는 이미 주거 조건 카드로 보여줬음)
// - REALISTIC: 목표 시점 · 목표 시점까지 준비 가능한 금액 rows (reachableAmountAtTargetDate는
//   아직 백엔드 응답에 없을 수 있어 null-safe하게 처리)
// - HOLD_OUT: 기준 목표 시점 -> 예상 도달 시점 timeline (공통 진단 기준의 targetDate가 있을 때만)
export function toBasisViewModel(recommendation, commonTargetDate) {
  const { type, loanX } = recommendation

  if (type === 'PREFERENCE') {
    return {
      title: '이 계획은 이렇게 구성했어요',
      description:
        '진단에 적용된 희망 조건을 중심으로 실제 거래 수준과 필요한 준비 금액을 계산했어요.',
      rows: [],
      timeline: null,
    }
  }

  if (type === 'REALISTIC') {
    const rows = [{ label: '목표 시점', value: formatYearMonth(loanX.targetDate) }]
    if (typeof recommendation.reachableAmountAtTargetDate === 'number') {
      rows.push({
        label: '목표 시점까지 준비 가능한 금액',
        value: formatGoalAmount(recommendation.reachableAmountAtTargetDate),
      })
    }

    return {
      title: '왜 이 조건이 나왔나요?',
      description:
        '목표 시점까지 준비할 수 있는 금액 범위에서 실제 거래가 가능한 주거 조건을 찾았어요.',
      rows,
      timeline: null,
    }
  }

  if (type === 'HOLD_OUT') {
    const extraMonths = commonTargetDate
      ? monthsBetweenYm(commonTargetDate, loanX.targetDate)
      : null

    return {
      title: '준비 기간은 이렇게 달라져요',
      description:
        extraMonths > 0
          ? `주거 조건을 유지하면 기존 목표 시점보다 약 ${formatMonthsToYearsKo(extraMonths)}의 준비 기간이 더 필요해요.`
          : null,
      rows: [],
      timeline: commonTargetDate
        ? {
            fromLabel: '기준 목표 시점',
            fromValue: formatYearMonth(commonTargetDate),
            toLabel: '예상 도달 시점',
            toValue: formatYearMonth(loanX.targetDate),
          }
        : null,
    }
  }

  return {
    title: RECOMMENDATION_TITLE_MAP[type] ?? recommendation.title,
    description: recommendation.reason,
    rows: [],
    timeline: null,
  }
}

// 진단 결과 화면 상단 "이번 진단 기준" 영역용. 세 계획에 공통으로 적용된 값이라 화면당 한 번만
// 보여준다. basis 자체가 없거나(구버전 응답 등) 개별 필드가 없으면 해당 항목만 빠진다 — 전부
// 없으면 호출부가 영역 자체를 숨긴다(23번 요구사항).
export function toDiagnosisBasisViewModel(basis) {
  if (!basis) return []

  const rows = []
  if (typeof basis.currentAvailableAmount === 'number') {
    rows.push({
      label: '현재 활용 가능 자금',
      value: formatGoalAmount(basis.currentAvailableAmount),
    })
  }
  if (typeof basis.monthlySaving === 'number') {
    rows.push({ label: '월 저축', value: formatGoalAmount(basis.monthlySaving) })
  }
  if (basis.targetDate) {
    rows.push({ label: '목표 시점', value: formatYearMonth(basis.targetDate) })
  }
  return rows
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
// (백엔드 계약이 확정되면 이 함수만 고치면 된다):
// - sizeMin/sizeMax: condition.areaMin/Max가 이제 평 단위로 내려오므로 변환 없이 그대로 사용
//   (목표 저장 API의 GoalHousing.areaMin/areaMax도 평 단위 — CLAUDE.md 3번 참고)
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
    sizeMin: condition.areaMin,
    sizeMax: condition.areaMax,
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
