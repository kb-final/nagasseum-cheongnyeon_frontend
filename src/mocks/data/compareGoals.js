// 또래 비교 — 목표 탭.
// 코호트 기준은 순자산 ±1,000만원 / 나이 ±2세. 페르소나 순자산이 3,048만원이므로
// 2,048만 ~ 4,048만원 구간의 25세 전후 또래가 비교 대상이다.
// 달성률은 페르소나가 70.5%로 코호트 평균(58.4%)보다 위에 오도록 맞췄다 —
// "나는 잘 하고 있구나"가 읽히는 편이 시연에서 메시지가 분명하다.
export const mockCompareGoalsSuccess = {
  success: true,
  data: {
    snapshotYm: '202611',
    cohort: {
      assetRange: 10000000,
      ageRange: 2,
      cohortSize: 183,
      appliedFilters: [],
      sufficient: true,
      minimumRequired: null,
    },
    myMonthlyIncome: 2100000,
    cohortAverageNetAssets: 31200000,
    achievement: {
      mine: 70.5,
      cohortAverage: 58.4,
      buckets: [
        { rangeMin: 0, rangeMax: 10, count: 4, ratio: 2.2, isMine: false },
        { rangeMin: 10, rangeMax: 20, count: 9, ratio: 4.9, isMine: false },
        { rangeMin: 20, rangeMax: 30, count: 14, ratio: 7.7, isMine: false },
        { rangeMin: 30, rangeMax: 40, count: 21, ratio: 11.5, isMine: false },
        { rangeMin: 40, rangeMax: 50, count: 29, ratio: 15.8, isMine: false },
        { rangeMin: 50, rangeMax: 60, count: 38, ratio: 20.8, isMine: false },
        { rangeMin: 60, rangeMax: 70, count: 32, ratio: 17.5, isMine: false },
        { rangeMin: 70, rangeMax: 80, count: 22, ratio: 12.0, isMine: true },
        { rangeMin: 80, rangeMax: 100, count: 14, ratio: 7.6, isMine: false },
      ],
    },
    dealTypeDistribution: [
      { dealType: 'JEONSE', label: '전세', ratio: 61.0, rank: 1 },
      { dealType: 'WOLSE', label: '월세', ratio: 39.0, rank: 2 },
    ],
    averageTargetAmount: 51000000,
    averagePrepMonths: 31,
    popularRegions: [
      { rank: 1, regionCode: '11440', regionName: '마포구', ratio: 24.0 },
      { rank: 2, regionCode: '11305', regionName: '강북구', ratio: 19.0 },
      { rank: 3, regionCode: '11350', regionName: '노원구', ratio: 15.0 },
    ],
  },
  error: null,
}

export const mockCompareGoalsInsufficient = {
  success: true,
  data: {
    snapshotYm: '202611',
    cohort: {
      assetRange: 10000000,
      ageRange: 2,
      cohortSize: null,
      appliedFilters: [],
      sufficient: false,
      minimumRequired: 10,
    },
    myMonthlyIncome: null,
    cohortAverageNetAssets: null,
    achievement: null,
    dealTypeDistribution: null,
    averageTargetAmount: null,
    averagePrepMonths: null,
    popularRegions: null,
  },
  error: null,
}

// 목표 자체가 없는 사용자. 목표 탭 잠금(teaser) 상태 확인용 — 필요할 때 핸들러에서 수동으로 바꿔 끼운다.
export const mockCompareGoalsSnapshotNotFound = {
  success: false,
  data: null,
  error: { code: 'COMPARE_SNAPSHOT_NOT_FOUND', message: '목표를 찾을 수 없습니다.' },
}

// 목표는 있으나 자산 연동이 없는 사용자.
export const mockCompareGoalsAssetRequired = {
  success: false,
  data: null,
  error: { code: 'COMPARE_ASSET_REQUIRED', message: '자산 연동이 필요합니다.' },
}
