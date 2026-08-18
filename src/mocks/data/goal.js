import { SIDO_LIST, GUGUN_BY_SIDO, findRegionBySigunguCode } from '@/shared/constants/regions'

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
const MOCK_RECOGNIZED_ASSETS = 250000000

// 지역/주거형태/거래유형별 실제 시세 데이터가 없어 고정 base 중앙값으로 근사한다 — 데모용 근사치.
const MOCK_MEDIAN_BASE = 460000000

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
    regionCode: '11680',
    housingType: 'OFFICETEL',
    dealType: 'JEONSE',
    areaMin: 10,
    areaMax: 20,
    depositMin: 300000000,
    depositMax: 600000000,
  },
  targetDate: '2028-09-30',
  progress: {
    targetAmount: 360000000,
    currentAmount: 347000000,
    remainingAmount: 13000000,
    achievementRate: 96.4,
  },
  savingStatus: {
    fixedSaving: 500000,
    recentAverageSaving: 620000,
    latestSaving: 700000,
  },
  forecasts: [
    { basis: 'FIXED', monthlySaving: 500000, expectedDate: '2028-09-30', monthsDiff: 0 },
    { basis: 'RECENT_AVERAGE', monthlySaving: 620000, expectedDate: '2028-04-30', monthsDiff: 5 },
    { basis: 'LATEST', monthlySaving: 700000, expectedDate: '2028-02-29', monthsDiff: 7 },
  ],
}

// GET /api/v1/goals/{goalId} 응답 mock ("목표 조회" API 명세 기준).
// 생성·수정 요청 본문과 같은 평평한 GoalResponse다. 수정 폼 재현용이라 지역은 이름이 아니라
// 코드(regionCode)로 내려오고, 전세라 월세는 null이 아니라 0으로 정규화된 값이 온다.
// targetDate는 날짜가 아니라 YYYY-MM이다.
export const mockGoal = {
  goalId: 1,
  status: 'ACTIVE',
  regionCode: '11680',
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
  targetRentMiddleAmount: 350000000,
  createdAt: '2026-08-05T14:32:10',
  updatedAt: '2026-08-06T17:21:44',
}

// GET /api/v1/goals/{goalId}/simulations/monthly-saving 응답 mock.
// 예상 달성 시점 계산은 백엔드 몫이므로 목에서도 계산하지 않고 고정 응답만 둔다.
// 여기 없는 금액은 준비된 목 데이터가 없다는 뜻이며, 실제 API가 붙으면 임의 금액도 모두 계산된다.
// 필드는 목표 달성 상세 조회의 forecasts[] 항목과 동일한 형태.
export const mockSavingSimulations = {
  550000: { basis: 'CUSTOM', monthlySaving: 550000, expectedDate: '2028-07-31', monthsDiff: 2 },
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

// GET /api/v1/goals/market-trend 응답 mock (홈 화면 API 명세서 예시값 그대로)
export const mockGoalMarketTrend = {
  regionName: '서울 강남구',
  housingType: 'OFFICETEL',
  dealType: 'JEONSE',
  areaMin: 10,
  areaMax: 20,
  updatedYm: '2026-07',
  changeAmount: 5000000,
  targetAmount: 100000000,
  initialMiddleAmount: 90000000,
  currentMiddleAmount: 95000000,
  maintainEta: '2027-08',
  reflectEta: '2027-03',
}

// GET /api/v1/goals/summary 응답 mock (홈 화면 API 명세서 예시값 그대로)
export const mockGoalSummaryHome = {
  goalId: 42,
  goalType: 'HOUSING',
  housing: {
    regionName: '서울 강남구',
    housingType: 'OFFICETEL',
    dealType: 'JEONSE',
    areaMin: 10,
    areaMax: 20,
  },
  targetAmount: 100000000,
  targetDate: '2027-08',
  progress: {
    currentAmount: 20000000,
    remainingAmount: 80000000,
    achievementRate: 20.0,
    remainingMonths: 12,
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

const PYEONG_TO_M2 = 3.3058

// 실거래 시세가 없어 지역 코드로 대충 갈라 쓴다 — 데모용 근사치일 뿐 의미 있는 값이 아니다.
const MOCK_RECOMMENDATION_MEDIAN = {
  JEONSE: 350000000,
  WOLSE: 50000000,
}

function resolveRegionName(regionCode) {
  if (!regionCode) return ''
  // 시도 2자리로 오면 시군구를 고르지 않는다 — 사용자가 묻지 않은 시군구를 정해주지 않는다는 규칙.
  if (regionCode.length === 2) {
    return SIDO_LIST.find((sido) => sido.code === regionCode)?.name ?? ''
  }
  const region = findRegionBySigunguCode(regionCode)
  return region ? `${region.sidoName} ${region.sigunguName}` : ''
}

function buildRecommendationCondition(payload, overrides = {}) {
  const dealType = overrides.dealType ?? payload.tradeType ?? 'JEONSE'
  const sizeMin = overrides.sizeMin ?? payload.sizeMin ?? 15
  const sizeMax = overrides.sizeMax ?? payload.sizeMax ?? 19
  const regionCode = overrides.regionCode ?? payload.regionCode

  return {
    regionCode,
    regionName: resolveRegionName(regionCode),
    housingType: overrides.housingType ?? payload.propertyType ?? 'APT',
    dealType,
    // 요청은 평, 응답은 전용면적 ㎡ 기준이라 여기서 환산한다.
    areaMin: Math.round(sizeMin * PYEONG_TO_M2),
    areaMax: Math.round(sizeMax * PYEONG_TO_M2),
    // 전세면 0, 월세면 실제 매달 내는 금액. 요청에 월세 범위가 있으면 그 중간값을 쓴다.
    monthlyRent:
      dealType === 'WOLSE'
        ? roundTo(((payload.monthlyRentMin ?? 0) + (payload.monthlyRentMax ?? 800000)) / 2, 10000)
        : 0,
    sampleCount: overrides.sampleCount ?? 142,
  }
}

function buildPlans(median, monthlySaving, loanAmount) {
  const ownFundsWithoutLoan = Math.max(median - MOCK_RECOGNIZED_ASSETS, 0)
  const ownFundsWithLoan = Math.max(ownFundsWithoutLoan - loanAmount, 0)
  const monthsWithoutLoan = Math.max(Math.ceil(ownFundsWithoutLoan / monthlySaving), 1)
  const monthsWithLoan = Math.max(Math.ceil(ownFundsWithLoan / monthlySaving), 1)

  return {
    loanX: {
      targetAmount: ownFundsWithoutLoan,
      targetDate: addMonths(currentYm(), monthsWithoutLoan),
      monthlySaving,
    },
    loanO: {
      loanAmount,
      targetAmount: ownFundsWithLoan,
      targetDate: addMonths(currentYm(), monthsWithLoan),
      monthlySaving,
    },
  }
}

export function buildMockRecommendations(payload) {
  const monthlySaving = 1000000
  const dealType = payload.tradeType ?? 'JEONSE'
  const median = MOCK_RECOMMENDATION_MEDIAN[dealType] ?? MOCK_RECOMMENDATION_MEDIAN.JEONSE

  // 시도 2자리로 요청하면 REALISTIC은 시군구까지 좁혀서 답한다. 목 데이터에는 실거래가 없으니
  // 그 시도의 첫 번째 구/군을 골라 "좁혀졌다"는 것만 재현한다.
  const firstGugun = GUGUN_BY_SIDO[payload.regionCode?.slice(0, 2)]?.[0]?.code
  const realisticRegionCode =
    payload.regionCode?.length === 2 && firstGugun ? firstGugun : payload.regionCode

  return {
    recommendations: [
      {
        type: 'PREFERENCE',
        title: '내가 원하는 조건 그대로',
        reason: `선택하신 ${resolveRegionName(payload.regionCode)} 조건의 최근 실거래 중앙값이에요.`,
        condition: buildRecommendationCondition(payload),
        ...buildPlans(median, monthlySaving, 80000000),
      },
      {
        type: 'REALISTIC',
        title: '지금 소득으로 현실적인 선택',
        reason: '현재 소득 수준에서 10년 안에 도달할 수 있는 조건을 찾았어요.',
        condition: buildRecommendationCondition(payload, {
          regionCode: realisticRegionCode,
          sampleCount: 389,
        }),
        ...buildPlans(roundTo(median * 0.62, 1000000), monthlySaving, 70000000),
      },
      {
        type: 'HOLD_OUT',
        title: '조금 더 모으면 갈 수 있는 곳',
        reason: '조건을 그대로 두고 시점만 늘렸을 때 도달 가능한 목표예요.',
        condition: buildRecommendationCondition(payload, {
          sizeMin: (payload.sizeMin ?? 15) + 5,
          sizeMax: (payload.sizeMax ?? 19) + 5,
          sampleCount: 76,
        }),
        ...buildPlans(roundTo(median * 1.35, 1000000), monthlySaving, 90000000),
      },
    ],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/goals/recommendation 응답 mock (진단 결과 화면 전용)
//
// 조건 입력 단계(recommendations, 쿼리 조건 기반)와 달리 memberId(인증 토큰)만으로 이미 계산된
// 추천 결과를 돌려받는 엔드포인트라 조건을 입력받지 않는다. 필드 구성·값은 명세서 예시
// (PREFERENCE/REALISTIC)를 그대로 옮기고, 명세서에 없던 HOLD_OUT만 같은 형식으로 채워 넣었다.
//
// area는 이제 ㎡가 아니라 평 단위로 내려온다고 가정한다. currentAvailableAmount/monthlySaving/
// targetDate는 recommendations 배열 밖의 공통 진단 기준이며, condition.marketMedianAmount와
// REALISTIC의 reachableAmountAtTargetDate는 아직 백엔드 응답에 없을 수 있는 필드라 이 mock에서만
// 명세서 예시값(현재 활용 가능 자금 5,000만 원 · 목표 시점 2034-12 · REALISTIC 실거래 중앙값
// 1억 5,000만 원)에 맞춰 채워 넣었다 — 실제 값은 없으면 화면이 해당 영역을 자동으로 숨긴다.
// ─────────────────────────────────────────────────────────────────────────────
export function buildMockRecommendationResult() {
  return {
    currentAvailableAmount: 50000000,
    monthlySaving: 1000000,
    targetDate: '2034-12',
    recommendations: [
      {
        type: 'PREFERENCE',
        title: '내가 원하는 조건 그대로',
        reason: '선택하신 마포구 아파트 전세 기준 중앙값입니다.',
        condition: {
          regionCode: '11440',
          regionName: '서울 마포구',
          housingType: 'APT',
          dealType: 'JEONSE',
          areaMin: 10,
          areaMax: 20,
          monthlyRent: 0,
          marketMedianAmount: 350000000,
          sampleCount: 142,
        },
        loanX: {
          targetAmount: 300000000,
          targetDate: '2051-08',
          monthlySaving: 1000000,
        },
        loanO: {
          loanAmount: 80000000,
          targetAmount: 220000000,
          targetDate: '2044-12',
          monthlySaving: 1000000,
          shortenedMonths: 80,
        },
      },
      {
        type: 'REALISTIC',
        title: '지금 소득으로 현실적인 선택',
        reason: '현재 소득 수준에서 10년 내 달성 가능한 조건을 찾았습니다.',
        condition: {
          regionCode: '41135',
          regionName: '경기 수원시 영통구',
          housingType: 'APT',
          dealType: 'JEONSE',
          areaMin: 15,
          areaMax: 20,
          monthlyRent: 0,
          marketMedianAmount: 150000000,
          sampleCount: 389,
        },
        reachableAmountAtTargetDate: 150000000,
        loanX: {
          targetAmount: 100000000,
          targetDate: '2034-12',
          monthlySaving: 1000000,
        },
        loanO: {
          loanAmount: 70000000,
          targetAmount: 30000000,
          targetDate: '2029-02',
          monthlySaving: 1000000,
          shortenedMonths: 70,
        },
      },
      {
        type: 'HOLD_OUT',
        title: '조금 더 모으면 갈 수 있는 곳',
        reason: '조건을 그대로 두고 시점만 늘렸을 때 도달 가능한 목표예요.',
        condition: {
          regionCode: '11440',
          regionName: '서울 마포구',
          housingType: 'APT',
          dealType: 'JEONSE',
          areaMin: 10,
          areaMax: 20,
          monthlyRent: 0,
          marketMedianAmount: 350000000,
          sampleCount: 142,
        },
        loanX: {
          targetAmount: 300000000,
          targetDate: '2040-06',
          monthlySaving: 1000000,
        },
      },
    ],
  }
}
