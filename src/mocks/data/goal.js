import { SIDO_LIST, GUGUN_BY_SIDO, findRegionBySigunguCode } from '@/shared/constants/regions'
import { isAfter3M } from '@/mocks/data/member'

// ── 시연 기준값 ──────────────────────────────────────────────────────────────
// 목표: 마포구(11440) 오피스텔 전세 10~20평 · 2029-08 · 월 저축 70만원
// 희망 조건 실거래 중앙값 2.2억 / 신규 대출 한도 1억 7,606만 / 자기 부담 4,394만
const DEMO_MEDIAN = 220_000_000
const DEMO_LOAN_AMOUNT = 176_060_000
const DEMO_SELF_FUNDED = 43_940_000
const DEMO_MONTHLY_SAVING = 700_000
const DEMO_CURRENT_BUDGET = isAfter3M ? 30_970_000 : 28_760_000
// ────────────────────────────────────────────────────────────────────────────

// POST /api/v1/goals/diagnosis 응답 mock.
// CLAUDE.md가 진단 응답의 정확한 필드 형태를 정의하지 않아 goal/goalHousing ERD를 참고해 추정한 형태 —
// 실제 백엔드 응답 확정 시 필드명(특히 optionId)을 맞춰야 한다.
export const mockDiagnosisOptions = [
  {
    optionId: 1,
    regionName: '강남구',
    housingType: '오피스텔',
    dealType: '월세',
    targetAmount: 650000000,
    targetRentMiddleAmount: 620000000,
    estimatedTargetDate: '2029-04',
    monthlySaving: 500000,
  },
  {
    optionId: 2,
    regionName: '서초구',
    housingType: '오피스텔',
    dealType: '전세',
    targetAmount: 580000000,
    targetRentMiddleAmount: 560000000,
    estimatedTargetDate: '2028-11',
    monthlySaving: 500000,
  },
  {
    optionId: 3,
    regionName: '강남구',
    housingType: '아파트',
    dealType: '월세',
    targetAmount: 720000000,
    targetRentMiddleAmount: 700000000,
    estimatedTargetDate: '2030-02',
    monthlySaving: 500000,
  },
]

// 실제 자산연동 결과가 없어 "현재 인식 자산"을 가상 상수로 둔다 — 실제로는 asset 도메인에서 가져와야 함.
const MOCK_RECOGNIZED_ASSETS = DEMO_CURRENT_BUDGET

// 지역/주거형태/거래유형별 실제 시세 데이터가 없어 고정 base 중앙값으로 근사한다 — 데모용 근사치.
const MOCK_MEDIAN_BASE = DEMO_MEDIAN

function currentYm() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function monthsBetween(fromYm, toYm) {
  const [fy, fm] = fromYm.split('-').map(Number)
  const [ty, tm] = toYm.split('-').map(Number)
  return (ty - fy) * 12 + (tm - fm)
}

function addMonths(ym, delta) {
  const [y, m] = ym.split('-').map(Number)
  const total = y * 12 + (m - 1) + delta
  const newY = Math.floor(total / 12)
  const newM = (total % 12) + 1
  return `${newY}-${String(newM).padStart(2, '0')}`
}

function roundTo(amount, unit) {
  return Math.round(amount / unit) * unit
}

function buildRegion(regionCodes) {
  return (regionCodes ?? [])
    .map((code) => {
      const found = findRegionBySigunguCode(code)
      return found ? { sido: found.sidoName, sigungu: found.sigunguName } : null
    })
    .filter(Boolean)
}

function buildMarketStats() {
  const median = MOCK_MEDIAN_BASE
  return {
    p25: roundTo(median * 0.88, 1000000),
    median,
    p75: roundTo(median * 1.18, 1000000),
  }
}

function buildAdjustmentSuggestions({
  shortfall,
  monthsRemaining,
  monthlySaving,
  targetDate,
  areaMin,
  areaMax,
  median,
  regionCodes,
}) {
  const planAdjustments = []
  const conditionAdjustments = []

  if (monthsRemaining > 0) {
    const deltaMonthlySavings = Math.ceil(shortfall / monthsRemaining / 10000) * 10000
    planAdjustments.push({
      type: 'INCREASE_SAVINGS',
      deltaMonthlySavings,
      newMonthlySavings: monthlySaving + deltaMonthlySavings,
    })
  }

  // 월 저축액이 0이어도(아직 입력 전이어도) 카드 2개가 항상 짝을 이루도록 최소 저축액을 가정해 계산한다.
  const deltaMonths = Math.ceil(shortfall / Math.max(monthlySaving, 10000))
  planAdjustments.push({
    type: 'EXTEND_TIMELINE',
    deltaMonths,
    newTargetDate: addMonths(targetDate, deltaMonths),
  })

  const avgArea = (areaMin + areaMax) / 2
  if (avgArea > 0) {
    const pricePerPyeong = median / avgArea
    const deltaSizeMax = -Math.ceil(shortfall / pricePerPyeong)
    conditionAdjustments.push({
      type: 'REDUCE_SIZE',
      deltaSizeMax,
      newSizeMax: Math.max(areaMax + deltaSizeMax, 1),
    })
  }

  const currentSigunguCode = regionCodes?.[0]
  const currentRegion = currentSigunguCode ? findRegionBySigunguCode(currentSigunguCode) : null
  const suggestedRegions = currentRegion
    ? (GUGUN_BY_SIDO[currentRegion.sidoCode] ?? [])
        .filter((gugun) => gugun.code !== currentSigunguCode)
        .slice(0, 2)
        .map((gugun) => gugun.name)
    : []
  conditionAdjustments.push({ type: 'NEARBY_REGION', suggestedRegions })

  return { planAdjustments, conditionAdjustments }
}

// 진단 입력값을 바탕으로 예산/시세 위치/조정 제안을 계산한다.
// 실제로는 백엔드가 자산·시세 데이터 기반으로 계산해 내려주는 값이며, 여기서는 UI 데모를 위한 근사치다.
export function buildMockDiagnosisResult(payload) {
  const monthsRemaining = Math.max(monthsBetween(currentYm(), payload.targetDate), 1)
  const monthlySaving = Number(payload.monthlySaving) || 0
  const projectedSavings = monthlySaving * monthsRemaining
  const totalBudget = MOCK_RECOGNIZED_ASSETS + projectedSavings

  const marketStats = buildMarketStats()
  const shortfall = Math.max(marketStats.median - totalBudget, 0)
  const status = shortfall > 0 ? 'INSUFFICIENT' : 'SUFFICIENT'

  const result = {
    region: buildRegion(payload.regions),
    propertyType: payload.housingType,
    tradeType: payload.dealType,
    marketStats,
    status,
    shortfall,
    adjustmentSuggestions:
      status === 'INSUFFICIENT'
        ? buildAdjustmentSuggestions({
            shortfall,
            monthsRemaining,
            monthlySaving,
            targetDate: payload.targetDate,
            areaMin: payload.areaMin,
            areaMax: payload.areaMax,
            median: marketStats.median,
            regionCodes: payload.regions,
          })
        : null,
  }

  return {
    budget: {
      totalBudget,
      recognizedAssets: MOCK_RECOGNIZED_ASSETS,
      projectedSavings,
    },
    results: [result],
  }
}

// POST /api/v1/goals mock 저장 응답 — 실제 DB 저장 없이 성공 응답만 흉내낸다.
export const mockGoalSaveResponse = { goalId: 1 }

// GET /api/v1/goals/{goalId}/detail 응답 mock ("목표 달성 상세 조회" API 명세 기준).
// 저축 기록이 3건 미만이면 forecasts에서 RECENT_AVERAGE가, 0건이면 FIXED 외 항목이 모두 빠진다.
export const mockGoalDetail = {
  goalId: 1,
  goalType: 'HOUSING',
  status: 'ACTIVE',
  housing: {
    regionCode: '11440',
    housingType: 'OFFICETEL',
    dealType: 'JEONSE',
    areaMin: 10,
    areaMax: 20,
    depositMin: 150000000,
    depositMax: 250000000,
  },
  targetDate: '2029-08-31',
  progress: {
    // 대출을 활용하는 계획을 선택했으므로, 목표 금액은 '직접 준비할 금액'이다.
    targetAmount: DEMO_SELF_FUNDED,
    currentAmount: DEMO_CURRENT_BUDGET,
    remainingAmount: DEMO_SELF_FUNDED - DEMO_CURRENT_BUDGET,
    achievementRate: Number(((DEMO_CURRENT_BUDGET / DEMO_SELF_FUNDED) * 100).toFixed(1)),
  },
  savingStatus: {
    fixedSaving: DEMO_MONTHLY_SAVING,
    // 목표를 막 저장한 직후에는 저축 이력이 없어 두 값이 비어 있다.
    recentAverageSaving: isAfter3M ? 730000 : null,
    latestSaving: isAfter3M ? 800000 : null,
  },
  forecasts: isAfter3M
    ? [
        {
          basis: 'FIXED',
          monthlySaving: DEMO_MONTHLY_SAVING,
          expectedDate: '2029-08-31',
          monthsDiff: 0,
        },
        {
          basis: 'RECENT_AVERAGE',
          monthlySaving: 730000,
          expectedDate: '2029-05-31',
          monthsDiff: 3,
        },
        { basis: 'LATEST', monthlySaving: 800000, expectedDate: '2028-12-31', monthsDiff: 8 },
      ]
    : [
        {
          basis: 'FIXED',
          monthlySaving: DEMO_MONTHLY_SAVING,
          expectedDate: '2029-08-31',
          monthsDiff: 0,
        },
      ],
}

// GET /api/v1/goals/{goalId} 응답 mock ("목표 조회" API 명세 기준).
// 생성·수정 요청 본문과 같은 평평한 GoalResponse다. 수정 폼 재현용이라 지역은 이름이 아니라
// 코드(regionCode)로 내려오고, 전세라 월세는 null이 아니라 0으로 정규화된 값이 온다.
// targetDate는 날짜가 아니라 YYYY-MM이다.
export const mockGoal = {
  goalId: 1,
  status: 'ACTIVE',
  regionCode: '11440',
  propertyType: mockGoalDetail.housing.housingType,
  tradeType: mockGoalDetail.housing.dealType,
  sizeMin: mockGoalDetail.housing.areaMin,
  sizeMax: mockGoalDetail.housing.areaMax,
  depositMin: mockGoalDetail.housing.depositMin,
  depositMax: mockGoalDetail.housing.depositMax,
  monthlyRentMin: 0,
  monthlyRentMax: 0,
  monthlySavings: mockGoalDetail.savingStatus.fixedSaving,
  targetDate: mockGoalDetail.targetDate.slice(0, 7),
  targetAmount: mockGoalDetail.progress.targetAmount,
  targetRentMiddleAmount: DEMO_MEDIAN,
  createdAt: '2026-08-18T14:32:10',
  updatedAt: '2026-08-18T14:32:10',
}

// GET /api/v1/goals/{goalId}/simulations/monthly-saving 응답 mock.
// 예상 달성 시점 계산은 백엔드 몫이므로 목에서도 계산하지 않고 고정 응답만 둔다.
// 여기 없는 금액은 준비된 목 데이터가 없다는 뜻이며, 실제 API가 붙으면 임의 금액도 모두 계산된다.
// 필드는 목표 달성 상세 조회의 forecasts[] 항목과 동일한 형태.
export const mockSavingSimulations = {
  // 목표 상세의 '추천 금액' 칩(최근 3개월 평균 / 최근 저축)과 챕터 ⑦에서 직접 입력할 90만원.
  730000: { basis: 'CUSTOM', monthlySaving: 730000, expectedDate: '2029-05-31', monthsDiff: 3 },
  800000: { basis: 'CUSTOM', monthlySaving: 800000, expectedDate: '2028-12-31', monthsDiff: 8 },
  900000: { basis: 'CUSTOM', monthlySaving: 900000, expectedDate: '2028-10-31', monthsDiff: 10 },
}

// PUT /api/v1/goals/{goalId} 는 아직 백엔드 구현 전이라, 목 핸들러가 위 두 fixture의 월 저축액을
// 메모리에서 갱신해 준다. 수정 직후 화면 이동 시 바뀐 값이 보이게 하려는 것이며,
// 브라우저를 새로고침하면 모듈이 다시 로드되어 초기값으로 돌아온다.
export function applyMockGoalUpdate({ monthlySavings }) {
  mockGoal.monthlySavings = monthlySavings
  mockGoalDetail.savingStatus.fixedSaving = monthlySavings

  const fixedForecast = mockGoalDetail.forecasts.find((forecast) => forecast.basis === 'FIXED')
  if (fixedForecast) fixedForecast.monthlySaving = monthlySavings
}

// GET /api/v1/goals/market-trend 응답 mock (API 명세서 예시값 그대로)
// initialMiddleAmount는 "설정 당시 중앙값"이 아니라 "진단 당시 몬테카를로로 예측한
// predictionTargetYm 시점 시세(P50)"다. currentMiddleAmount(현재 실거래 중앙값)와는
// 기준 시점이 다르므로 두 값을 직접 비교/차감하지 않는다.
// predictionTargetYm은 목표(goal.targetDate) 시점 정보라 최신 예측 성공 여부와 무관하게
// 항상 내려온다(null 아님). 최신 예측이 실패하면 latestPredictedMarketAmount /
// predictionChangeAmount만 null이 된다.
export const mockGoalMarketTrend = {
  regionName: '서울 마포구',
  housingType: 'OFFICETEL',
  dealType: 'JEONSE',
  areaMin: 10,
  areaMax: 20,
  updatedYm: isAfter3M ? '2026-11' : '2026-08',
  // 3개월 사이 마포구 중앙값이 1,200만원 올라, 목표를 유지하면 도달 시점이 6개월 밀린다.
  currentMiddleAmount: isAfter3M ? 232000000 : DEMO_MEDIAN,
  predictionTargetYm: '2029-08',
  initialMiddleAmount: DEMO_MEDIAN,
  latestPredictedMarketAmount: isAfter3M ? 244000000 : DEMO_MEDIAN,
  predictionChangeAmount: isAfter3M ? 24000000 : 0,
  targetAmount: DEMO_MEDIAN,
  maintainEta: '2029-08',
  reflectEta: isAfter3M ? '2030-02' : '2029-08',
}

// GET /api/v1/goals/active 응답 mock ("활성 목표 조회" API 명세 기준)
export const mockActiveGoal = {
  goalId: mockGoal.goalId,
  goalType: 'HOUSING',
  status: 'ACTIVE',
  targetAmount: mockGoal.targetAmount,
  targetDate: mockGoal.targetDate,
}

// GET /api/v1/goals/summary 응답 mock (홈 화면 API 명세서 예시값 그대로)
export const mockGoalSummaryHome = {
  goalId: 1,
  goalType: 'HOUSING',
  housing: {
    regionName: '서울 마포구',
    housingType: 'OFFICETEL',
    dealType: 'JEONSE',
    areaMin: 10,
    areaMax: 20,
  },
  targetAmount: DEMO_SELF_FUNDED,
  targetDate: '2029-08',
  progress: {
    currentAmount: DEMO_CURRENT_BUDGET,
    remainingAmount: DEMO_SELF_FUNDED - DEMO_CURRENT_BUDGET,
    achievementRate: Number(((DEMO_CURRENT_BUDGET / DEMO_SELF_FUNDED) * 100).toFixed(1)),
    remainingMonths: isAfter3M ? 33 : 36,
  },
}

// 활성 목표가 없을 때(GOAL_001) 흐름 확인용
export const mockGoalNotFoundResponse = {
  success: false,
  data: null,
  error: { code: 'GOAL_001', message: '활성 목표를 찾을 수 없습니다.' },
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/goals/recommendations 응답 mock
//
// 필드 구성은 백엔드 GoalRecommendationResponse를 그대로 따른다. 명세서 예시에 있는
// loanO.shortenedMonths는 백엔드 DTO(LoanOPlan)에 없어 여기서도 넣지 않는다 — 백엔드에
// 추가되면 여기와 결과 화면을 같이 고쳐야 한다.
//
// VALUE 알고리즘은 아직 미구현이라(명세서 "알고리즘 구현 현황" 2026-08-12 기준) 응답에서 빠진다.
// 대안을 내지 못한 알고리즘은 응답에서 제외되므로 recommendations 길이가 4보다 작을 수 있다는
// 계약을, 목에서도 그대로 재현해 두는 편이 화면 검증에 유리하다.
// ─────────────────────────────────────────────────────────────────────────────

function resolveRegionName(regionCode) {
  if (!regionCode) return ''
  // 시도 2자리로 오면 시군구를 고르지 않는다 — 사용자가 묻지 않은 시군구를 정해주지 않는다는 규칙.
  if (regionCode.length === 2) {
    return SIDO_LIST.find((sido) => sido.code === regionCode)?.name ?? ''
  }
  const region = findRegionBySigunguCode(regionCode)
  return region ? `${region.sidoName} ${region.sigunguName}` : ''
}

export function buildMockRecommendations(payload) {
  // 조건 입력 직후(GET /goals/recommendations)와 결과 화면(GET /goals/recommendation)이
  // 서로 다른 숫자를 보여주면 시연 중에 값이 튄다. 같은 fixture를 쓰되, 사용자가 고른
  // 지역만 반영해 "내가 입력한 조건으로 찾았다"는 인상은 유지한다.
  const base = buildMockRecommendationResult()
  const regionCode = payload?.regionCode
  if (!regionCode || regionCode === '11440') return { recommendations: base.recommendations }

  const regionName = resolveRegionName(regionCode)
  return {
    recommendations: base.recommendations.map((item) => ({
      ...item,
      condition: { ...item.condition, regionCode, regionName },
    })),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/goals/recommendation 응답 mock (진단 결과 화면 전용)
//
// 조건 입력 단계(recommendations, 쿼리 조건 기반)와 달리 memberId(인증 토큰)만으로 이미 계산된
// 추천 결과를 돌려받는 엔드포인트라 조건을 입력받지 않는다. 필드 구성은 실제 백엔드 응답
// 예시를 그대로 옮긴 것이다(2026-08-19 확인):
// - originalPreference: 진단 시 사용자가 입력한 원래 희망 조건 + 목표 시점/월 저축액.
//   targetDate는 사용자가 목표 시점을 입력하지 않았으면 null일 수 있다 — 이때는
//   recommendations에 PREFERENCE_DATE_FIXED 자체가 없다(아래
//   buildMockRecommendationResultWithoutDateFixed 참고).
// - recommendations[].type: PREFERENCE_SAVING_FIXED(월 저축 고정) / PREFERENCE_DATE_FIXED
//   (목표 시점 고정, 없을 수 있음) / REALISTIC / HOLD_OUT 4종.
// - condition.marketMedianAmount는 "현재" 실거래 중앙값이 아니라 loanX.targetDate 시점
//   기준으로 예측한 미래 시세다. recommendation은 기본적으로
//   marketMedianAmount(목표 시점 예상 시세) < loanX.targetAmount(대출 없이 준비 가능한
//   예산)일 때만 성립하는 구조라(이 예산이면 이 조건을 살 수 있다는 뜻), 여기서도 두 값을
//   같게 두지 않는다 — 화면 검증 시 두 필드의 의미가 섞이지 않았는지 확인할 수 있게 한다.
// ─────────────────────────────────────────────────────────────────────────────
export function buildMockRecommendationResult() {
  const preferenceCondition = {
    regionCode: '11440',
    regionName: '서울특별시 마포구',
    housingType: 'OFFICETEL',
    dealType: 'JEONSE',
    // FE가 ㎡→평 변환 없이 그대로 '평'으로 표시하므로 평 단위로 둔다.
    areaMin: 10,
    areaMax: 20,
    depositMin: 150000000,
    depositMax: 250000000,
    monthlyRent: 0,
    sampleCount: 268,
    marketMedianAmount: DEMO_MEDIAN,
  }

  return {
    originalPreference: {
      condition: {
        regionCode: '11440',
        regionName: '서울특별시 마포구',
        housingType: 'OFFICETEL',
        dealType: 'JEONSE',
        areaMin: 10,
        areaMax: 20,
        depositMin: 150000000,
        depositMax: 250000000,
        monthlyRentMin: null,
        monthlyRentMax: null,
      },
      targetDate: '2029-08',
      monthlySaving: DEMO_MONTHLY_SAVING,
    },
    recommendations: [
      // 지금 저축대로 모으면 — 월 70만원을 유지하면 2041년 11월. "3년 안엔 어렵네"가 여기서 나온다.
      {
        type: 'PREFERENCE_SAVING_FIXED',
        condition: { ...preferenceCondition },
        loanX: {
          targetAmount: DEMO_MEDIAN,
          targetDate: '2041-11',
          monthlySaving: DEMO_MONTHLY_SAVING,
        },
        loanO: {
          loanAmount: DEMO_LOAN_AMOUNT,
          targetAmount: DEMO_SELF_FUNDED,
          targetDate: '2028-04',
          monthlySaving: DEMO_MONTHLY_SAVING,
          shortenedMonths: 163,
        },
      },
      // 목표 시점에 맞추려면 — 챕터 ⑥에서 여는 카드. 대출 없이 493만원 vs 대출 활용 시 38만원.
      {
        type: 'PREFERENCE_DATE_FIXED',
        condition: { ...preferenceCondition },
        loanX: {
          targetAmount: DEMO_MEDIAN,
          targetDate: '2029-08',
          monthlySaving: 4934000,
        },
        loanO: {
          loanAmount: DEMO_LOAN_AMOUNT,
          targetAmount: DEMO_SELF_FUNDED,
          targetDate: '2029-08',
          monthlySaving: 384000,
          shortenedMonths: 0,
        },
      },
      // 현재 준비 상황을 반영하면 — 지역은 그대로 두고 평수를 줄여 지금 갈 수 있는 조건을 찾는다.
      {
        type: 'REALISTIC',
        condition: {
          ...preferenceCondition,
          areaMin: 6,
          areaMax: 10,
          sampleCount: 47,
          marketMedianAmount: 56000000,
        },
        loanX: {
          targetAmount: 56000000,
          targetDate: '2029-05',
          monthlySaving: DEMO_MONTHLY_SAVING,
        },
        loanO: {
          loanAmount: 30000000,
          targetAmount: 26000000,
          targetDate: '2026-09',
          monthlySaving: DEMO_MONTHLY_SAVING,
          shortenedMonths: 32,
        },
      },
      // 선택의 폭을 넓혀보면 — 평수를 올리고 시점을 늘렸을 때.
      {
        type: 'HOLD_OUT',
        condition: {
          ...preferenceCondition,
          areaMin: 20,
          areaMax: 25,
          sampleCount: 91,
          marketMedianAmount: 285000000,
        },
        loanX: {
          targetAmount: 285000000,
          targetDate: '2045-06',
          monthlySaving: DEMO_MONTHLY_SAVING,
        },
        loanO: {
          loanAmount: DEMO_LOAN_AMOUNT,
          targetAmount: 108940000,
          targetDate: '2034-02',
          monthlySaving: DEMO_MONTHLY_SAVING,
          shortenedMonths: 136,
        },
      },
    ],
  }
}

// 목표 시점을 입력하지 않고 진단한 경우의 응답 mock. 이때는 PREFERENCE_DATE_FIXED
// recommendation 자체가 응답에 없다 — 결과 화면의 "희망 조건을 기준으로" 영역에 카드가 1개만
// 있어도 빈 자리 없이 자연스럽게 이어지는지 확인할 때 쓴다. mockGoalNotFoundResponse와 같은
// 방식으로, 기본으로 연결돼 있지는 않으니 확인하려면 goalHandlers.js의
// GET /goals/recommendation 핸들러에서 buildMockRecommendationResult 대신 이 함수를 임시로
// 호출해보면 된다.
export function buildMockRecommendationResultWithoutDateFixed() {
  const base = buildMockRecommendationResult()
  return {
    originalPreference: { ...base.originalPreference, targetDate: null },
    recommendations: base.recommendations.filter((item) => item.type !== 'PREFERENCE_DATE_FIXED'),
  }
}
