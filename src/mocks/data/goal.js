import { GUGUN_BY_SIDO, findRegionBySigunguCode } from '@/shared/constants/regions'

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
    title: '강남구 오피스텔 전세',
    regionName: '강남구',
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
// 수정 폼 재현용이라 지역은 이름이 아니라 코드 배열로 내려온다.
export const mockGoal = {
  goalId: 1,
  goalType: 'HOUSING',
  status: 'ACTIVE',
  targetAmount: mockGoalDetail.progress.targetAmount,
  targetDate: mockGoalDetail.targetDate,
  monthlySaving: mockGoalDetail.savingStatus.fixedSaving,
  housing: {
    regions: ['11680'],
    housingTypes: [mockGoalDetail.housing.housingType],
    dealTypes: [mockGoalDetail.housing.dealType],
    areaMin: mockGoalDetail.housing.areaMin,
    areaMax: mockGoalDetail.housing.areaMax,
    depositMin: mockGoalDetail.housing.depositMin,
    depositMax: mockGoalDetail.housing.depositMax,
    monthlyRentMin: null,
    monthlyRentMax: null,
  },
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
export function applyMockGoalUpdate({ monthlySaving }) {
  mockGoal.monthlySaving = monthlySaving
  mockGoalDetail.savingStatus.fixedSaving = monthlySaving

  const fixedForecast = mockGoalDetail.forecasts.find((forecast) => forecast.basis === 'FIXED')
  if (fixedForecast) fixedForecast.monthlySaving = monthlySaving
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
