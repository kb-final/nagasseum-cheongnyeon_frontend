import {
  formatAreaRange,
  formatGoalAmount,
  formatYearMonth,
  formatMonthsToYearsKo,
} from '@/shared/utils/formatter'
import { HOUSING_TYPE_LABEL, DEAL_TYPE_LABEL } from '@/shared/constants/housing'

// 진단 결과 화면(추천 계획 비교 리스트)의 카드 정렬 순서. API 배열 순서를 그대로 믿지 않고
// 항상 이 순서로 재정렬한다. 목록에 없는(향후 추가될) type은 정의된 type들 뒤에 붙인다.
// PREFERENCE_DATE_FIXED는 사용자가 목표 시점을 입력하지 않으면 응답 자체에 없을 수 있다
// (없으면 그냥 카드가 하나 빠질 뿐, 빈 자리나 placeholder를 만들지 않는다).
const TYPE_ORDER = {
  PREFERENCE_SAVING_FIXED: 0,
  PREFERENCE_DATE_FIXED: 1,
  REALISTIC: 2,
  HOLD_OUT: 3,
}

// 결과 화면에서 "희망 조건을 기준으로" 그룹에 묶이는 type. 나머지(REALISTIC/HOLD_OUT 등)는
// "다른 선택지도 살펴보세요" 그룹으로 분류된다.
const PREFERENCE_GROUP_TYPES = new Set(['PREFERENCE_SAVING_FIXED', 'PREFERENCE_DATE_FIXED'])

// API의 title을 그대로 쓰지 않고 화면 전용 제목으로 바꾼다.
export const RECOMMENDATION_TITLE_MAP = {
  PREFERENCE_SAVING_FIXED: '지금 저축대로 모으면',
  PREFERENCE_DATE_FIXED: '목표 시점에 맞추려면',
  REALISTIC: '현재 준비 상황을 반영하면',
  HOLD_OUT: '선택의 폭을 넓혀보면',
}

// 제목 아래 한 줄로 각 계획이 무엇을 보여주는지 자연어 문장으로 설명한다. "월 저축 유지 ·
// 예상 시점 계산"처럼 알고리즘 절차를 나열하지 않고, 사용자가 이 카드를 눌러야 하는 이유를
// 문장으로 전달한다.
export const RECOMMENDATION_STRATEGY_MAP = {
  PREFERENCE_SAVING_FIXED: '지금처럼 모았을 때 언제 도달하는지 확인해보세요',
  PREFERENCE_DATE_FIXED: '원하는 시점까지 필요한 저축액을 확인해보세요',
  REALISTIC: '현재 자금과 저축을 반영한 주거 선택지예요',
  HOLD_OUT: '조금 더 준비했을 때 고려할 수 있는 주거 선택지예요',
}

// 비교 카드로 그릴 수 있는(유효한) 추천인지 판별한다. 백엔드는 "현재 저축 계획으로는 원하는
// 조건 달성이 어려운" HOLD_OUT 케이스를 condition/loanX 전부 null(안내용 title·reason만 채운)로
// 내려준다 — 이 카드는 지역·유형·금액·시점을 비교해 보여주는 게 목적이라 그 값들이 없으면 그릴 수
// 없으므로 목록에서 제외한다(배포 동작과 동일). 비교 대상이 아닌 안내 문구는 카드로 만들지 않는다.
export function isComparableRecommendation(recommendation) {
  return recommendation?.condition != null && recommendation?.loanX != null
}

// API 배열을 화면에 표시할 순서로 정렬한다. 정의된 type 우선순위 뒤로는 원래 순서를 유지한다.
export function sortRecommendations(recommendations) {
  return [...(recommendations ?? [])].sort(
    (a, b) =>
      (TYPE_ORDER[a.type] ?? Number.MAX_SAFE_INTEGER) -
      (TYPE_ORDER[b.type] ?? Number.MAX_SAFE_INTEGER),
  )
}

// 결과 화면 카드 목록을 "희망 조건을 기준으로"/"다른 선택지도 살펴보세요" 두 그룹으로 나눈다.
// 정렬·비교 가능 여부 필터링까지 이 함수 하나로 끝내, 화면(템플릿)에는 type 분기가 남지 않게 한다.
export function groupRecommendationsForResult(recommendations) {
  const sorted = sortRecommendations(recommendations).filter(isComparableRecommendation)
  return {
    preferenceGroup: sorted.filter((item) => PREFERENCE_GROUP_TYPES.has(item.type)),
    otherGroup: sorted.filter((item) => !PREFERENCE_GROUP_TYPES.has(item.type)),
  }
}

// 결과 화면 카드용 "지역 · 유형 · 거래 · 면적" 한 줄 요약. 세 계획을 빠르게 비교하는 게 목적이라
// 상세 화면(toHousingViewModel)처럼 지역/조건/면적을 줄바꿈해서 나누지 않고 하나로 합친다.
// "전용" 접두어는 붙이지 않고 면적(평)을 그대로 이어붙인다.
// "서울 마포구 · 아파트 · 전세 · 10~20평" (월세면서 실제 월세액이 있으면 "· 월 60만 원"을 이어붙인다)
function toConditionSummary(condition) {
  const summary = [
    condition.regionName,
    HOUSING_TYPE_LABEL[condition.housingType] ?? condition.housingType,
    DEAL_TYPE_LABEL[condition.dealType] ?? condition.dealType,
    `${condition.areaMin}~${condition.areaMax}평`,
  ]
    .filter(Boolean)
    .join(' · ')

  if (condition.dealType === 'WOLSE' && condition.monthlyRent > 0) {
    return `${summary} · 월 ${formatGoalAmount(condition.monthlyRent)}`
  }
  return summary
}

// "15~20평" (월세면서 실제 월세액이 있으면 "· 월 60만 원"을 이어붙인다)
// 결과 화면과 용어를 통일하기 위해 "전용" 접두어는 붙이지 않는다.
function toConditionArea(condition) {
  const areaLabel = formatAreaRange(condition.areaMin, condition.areaMax)

  if (condition.dealType === 'WOLSE' && condition.monthlyRent > 0) {
    return `${areaLabel} · 월 ${formatGoalAmount(condition.monthlyRent)}`
  }
  return areaLabel
}

// 결과 카드 2열 핵심 정보의 label/value 쌍. type마다 사용자가 비교해야 하는 값이 달라
// 공통 label로 통일하지 않는다. resultSide는 둘 중 어느 쪽이 "계산된 결과값"인지 나타내며
// (나머지 한쪽은 입력/기준값), RecommendationCard가 그 쪽 font-weight만 한 단계 높인다
// (font-size나 색상은 바꾸지 않는다).
// - PREFERENCE_SAVING_FIXED: 월 저축을 고정해두고 계산한 결과라 "월 저축 → 예상 도달 시점"
//   관계가 핵심이고, 오른쪽(예상 도달 시점)이 결과값이다. targetAmount는 이 카드에서 메인
//   비교 수치가 아니다.
// - PREFERENCE_DATE_FIXED: 반대로 목표 시점을 고정해두고 계산한 결과라 "목표 시점 → 필요
//   월 저축" 관계가 핵심이고, 오른쪽(필요 월 저축)이 결과값이다. monthlySaving은 사용자의
//   기존 저축액이 아니라 그 시점에 도달하기 위해 새로 계산된 필요 저축액이므로 label을
//   "필요 월 저축"으로 명확히 한다.
// - REALISTIC/HOLD_OUT: loanX.targetAmount가 이 계획의 목표 금액 그 자체이자 핵심
//   결과라("추가 준비 금액"이 아니다 — 이미 모은 돈을 뺀 값이 아니다) 왼쪽(목표 금액)이
//   결과값이다.
function toRecommendationMetrics({ type, loanX }) {
  if (type === 'PREFERENCE_SAVING_FIXED') {
    return {
      leftLabel: '월 저축',
      leftValue: formatGoalAmount(loanX.monthlySaving),
      rightLabel: '예상 도달 시점',
      rightValue: formatYearMonth(loanX.targetDate),
      resultSide: 'right',
    }
  }

  if (type === 'PREFERENCE_DATE_FIXED') {
    return {
      leftLabel: '목표 시점',
      leftValue: formatYearMonth(loanX.targetDate),
      rightLabel: '필요 월 저축',
      rightValue: formatGoalAmount(loanX.monthlySaving),
      resultSide: 'right',
    }
  }

  return {
    leftLabel: '목표 금액',
    leftValue: formatGoalAmount(loanX.targetAmount),
    rightLabel: '예상 도달 시점',
    rightValue: formatYearMonth(loanX.targetDate),
    resultSide: 'left',
  }
}

// recommendation 원본 응답을 RecommendationCard가 그대로 그릴 수 있는 표시용 값으로 변환한다.
export function toRecommendationViewModel(recommendation) {
  const { type, condition } = recommendation

  return {
    type,
    title: RECOMMENDATION_TITLE_MAP[type] ?? recommendation.title,
    strategy: RECOMMENDATION_STRATEGY_MAP[type] ?? '',
    conditionSummary: toConditionSummary(condition),
    ...toRecommendationMetrics(recommendation),
  }
}

// 상세 화면 상단 한 줄 설명. REALISTIC/HOLD_OUT은 고정 문구지만, PREFERENCE 두 type은 사용자가
// 실제로 입력/도달하는 값(월 저축액·목표 시점)을 문장에 그대로 넣어야 해서 동적으로 만든다
// (mock 숫자를 하드코딩하지 않고 항상 loanX 값을 formatter로 표시한다).
const RECOMMENDATION_DETAIL_DESCRIPTION_MAP = {
  REALISTIC: '현재 상황을 고려한 주거 선택지예요.',
  HOLD_OUT: '조금 더 준비했을 때 고려할 수 있는 선택지예요.',
}

export function toRecommendationDescription(recommendation) {
  if (!recommendation) return ''
  const { type, loanX } = recommendation

  if (type === 'PREFERENCE_SAVING_FIXED') {
    return `월 ${formatGoalAmount(loanX.monthlySaving)}씩 꾸준히 모았을 때의 계획이에요.`
  }
  if (type === 'PREFERENCE_DATE_FIXED') {
    return `${formatYearMonth(loanX.targetDate)}까지 준비하기 위해 필요한 저축액을 계산했어요.`
  }
  return RECOMMENDATION_DETAIL_DESCRIPTION_MAP[type] ?? ''
}

// 상세 화면 "주거 조건" 카드용. 목록 카드(toConditionSummary)와 달리 지역명을 독립된 줄로 강조하고
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
        ? `같은 조건의 실거래 ${condition.sampleCount.toLocaleString('ko-KR')}건 기준`
        : null,
  }
}

// 상세 화면 "핵심 카드"(주거 조건 카드 바로 아래)용. REALISTIC은 조건·시세 자체가 이미
// 핵심 결과라 이 카드를 따로 두지 않는다(null이면 호출부가 카드를 숨긴다). 나머지 세 type은
// "A → B" 관계를 강조하는 게 목적이라 같은 compare-box 스타일(RecommendationCompareCard)을
// 재사용하되, type마다 비교하는 값이 다르다.
export function toCompareCardViewModel(recommendation, recommendations) {
  if (!recommendation) return null
  const { type, loanX } = recommendation

  if (type === 'PREFERENCE_SAVING_FIXED') {
    return {
      title: '지금처럼 모으면',
      rows: [
        {
          fromLabel: '월 저축',
          fromValue: formatGoalAmount(loanX.monthlySaving),
          toLabel: '예상 도달 시점',
          toValue: formatYearMonth(loanX.targetDate),
        },
      ],
    }
  }

  if (type === 'PREFERENCE_DATE_FIXED') {
    return {
      title: '이때까지 준비하려면',
      rows: [
        {
          fromLabel: '목표 시점',
          fromValue: formatYearMonth(loanX.targetDate),
          toLabel: '필요 월 저축',
          toValue: formatGoalAmount(loanX.monthlySaving),
        },
      ],
    }
  }

  if (type === 'HOLD_OUT') {
    const realistic = (recommendations ?? []).find((item) => item.type === 'REALISTIC')
    return toHoldOutCompareRows(realistic, recommendation)
  }

  return null
}

// HOLD_OUT은 REALISTIC과 비교해야 의미가 있어, 같은 응답 안에서 배열 순서가 아니라 항상
// type으로 REALISTIC을 찾는다(호출부 책임). 지역/유형/거래가 같다는 전제로 면적·실거래
// 중앙값 두 가지만 비교하며, 둘 중 하나라도 없으면 null을 돌려주고 호출부가 카드를 숨긴다
// (없는 값으로 비교를 지어내지 않는다).
function toHoldOutCompareRows(realistic, holdOut) {
  if (!realistic || !holdOut) return null
  const realisticMedian = realistic.condition?.marketMedianAmount
  const holdOutMedian = holdOut.condition?.marketMedianAmount
  if (typeof realisticMedian !== 'number' || typeof holdOutMedian !== 'number') return null

  return {
    title: '선택의 폭을 넓히면 이렇게 달라져요',
    rows: [
      {
        fromLabel: '현재 준비 상황 반영',
        fromValue: toConditionArea(realistic.condition),
        toLabel: '선택의 폭 확대',
        toValue: toConditionArea(holdOut.condition),
      },
      {
        fromLabel: '현재 준비 상황 반영',
        fromValue: formatGoalAmount(realisticMedian),
        toLabel: '선택의 폭 확대',
        toValue: formatGoalAmount(holdOutMedian),
      },
    ],
  }
}

// 월 저축이 0원인 recommendation(REALISTIC 등)은 "월 저축 0원"을 억지로 보여주지 않고
// 예상 도달 시점만 단독으로 보여준다. 반환된 배열은 그대로 2열(있으면) 그리드에 v-for로
// 뿌려지므로, 항목이 1개면 자연히 한 칸만 채워진다.
function toFundingRows({ monthlySaving, targetDate }) {
  const rows = []
  if (monthlySaving > 0) {
    rows.push({ label: '월 저축', value: formatGoalAmount(monthlySaving) })
  }
  rows.push({ label: '예상 도달 시점', value: formatYearMonth(targetDate) })
  return rows
}

// loanO가 있을 때 "대출을 활용하면" 영역용. PREFERENCE_DATE_FIXED는 목표 시점이 이미
// 고정돼 있어 대출 효과를 "기간 단축"이 아니라 "월 저축 부담 감소"로 보여준다 — 반대로
// 나머지 세 type은 월 저축액(또는 목표 자체)이 고정이라 대출 효과가 "도달 시점 단축"이다.
function toWithLoanViewModel({ loanX, loanO, isDateFixed }) {
  if (isDateFixed) {
    const reducedMonthlySaving = Math.max(loanX.monthlySaving - loanO.monthlySaving, 0)
    return {
      firstRow: [
        { label: '예상 대출 금액', value: formatGoalAmount(loanO.loanAmount) },
        { label: '필요 월 저축', value: formatGoalAmount(loanO.monthlySaving) },
      ],
      secondRow: [],
      highlight:
        reducedMonthlySaving > 0
          ? {
              prefix: '대출을 활용하면 매달',
              emphasis: formatGoalAmount(reducedMonthlySaving),
              suffix: '적게 준비해도 돼요.',
            }
          : null,
    }
  }

  return {
    firstRow: [
      { label: '예상 대출 금액', value: formatGoalAmount(loanO.loanAmount) },
      { label: '대출 반영 목표 금액', value: formatGoalAmount(loanO.targetAmount) },
    ],
    secondRow: toFundingRows(loanO),
    highlight:
      typeof loanO.shortenedMonths === 'number' && loanO.shortenedMonths > 0
        ? {
            prefix: '대출을 활용하면 예상 도달 시점이',
            emphasis: formatMonthsToYearsKo(loanO.shortenedMonths),
            suffix: '빨라져요.',
          }
        : null,
  }
}

// 상세 화면 "이 목표를 준비하려면" 카드용. loanO가 없으면 withLoan을 null로 돌려주고,
// 호출부가 그 section을 통째로 렌더링하지 않는다.
//
// PREFERENCE_DATE_FIXED만 다르게 구성한다 — 나머지 세 type(PREFERENCE_SAVING_FIXED/
// REALISTIC/HOLD_OUT)은 loanX.targetAmount가 이 계획의 목표 금액 그 자체라 그 값을 크게
// 보여주지만, DATE_FIXED는 목표 시점이 이미 고정돼 있어(핵심 카드에서 이미 보여줌)
// targetAmount 대신 "필요 월 저축"을 강조한다.
export function toFundingViewModel(recommendation) {
  const { type, loanX, loanO } = recommendation
  const isDateFixed = type === 'PREFERENCE_DATE_FIXED'

  const withoutLoan = isDateFixed
    ? {
        primaryLabel: '필요 월 저축',
        primaryValueLabel: formatGoalAmount(loanX.monthlySaving),
        rows: [],
      }
    : {
        primaryLabel: '목표 금액',
        primaryValueLabel: formatGoalAmount(loanX.targetAmount),
        rows: toFundingRows(loanX),
      }

  return {
    withoutLoan,
    withLoan: loanO ? toWithLoanViewModel({ loanX, loanO, isDateFixed }) : null,
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
