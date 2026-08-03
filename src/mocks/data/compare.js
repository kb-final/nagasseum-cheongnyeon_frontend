export const mockCompareSuccess = {
  success: true,
  data: {
    snapshotYm: '202607',
    cohort: {
      assetRange: 10000000,
      ageRange: 2,
      cohortSize: 247,
    },
    dealTypeDistribution: {
      topDealType: 'JEONSE',
      items: [
        { dealType: 'JEONSE', label: '전세', ratio: 73.0, rank: 1 },
        { dealType: 'WOLSE', label: '월세', ratio: 27.0, rank: 2 },
      ],
    },
    averageTargetAmount: 24000000,
    averagePrepMonths: 14,
    achievementDistribution: {
      myRate: 60.0,
      cohortAverageRate: 52.0,
      buckets: [
        { rangeMin: 0, rangeMax: 10, count: 3, ratio: 1.2, isMine: false },
        { rangeMin: 10, rangeMax: 20, count: 12, ratio: 4.9, isMine: false },
        { rangeMin: 20, rangeMax: 30, count: 18, ratio: 7.3, isMine: false },
        { rangeMin: 30, rangeMax: 40, count: 34, ratio: 13.8, isMine: false },
        { rangeMin: 40, rangeMax: 50, count: 52, ratio: 21.1, isMine: false },
        { rangeMin: 50, rangeMax: 60, count: 61, ratio: 24.7, isMine: false },
        { rangeMin: 60, rangeMax: 70, count: 38, ratio: 15.4, isMine: true },
        { rangeMin: 70, rangeMax: 80, count: 19, ratio: 7.7, isMine: false },
        { rangeMin: 80, rangeMax: 100, count: 10, ratio: 4.0, isMine: false },
      ],
    },
    popularRegions: [
      { rank: 1, regionCode: '11680', regionName: '강남구', ratio: 38.0 },
      { rank: 2, regionCode: '11440', regionName: '마포구', ratio: 26.0 },
      { rank: 3, regionCode: '11410', regionName: '서대문구', ratio: 17.0 },
    ],
    savingRange: {
      myMonthlySaving: 900000,
      cohortRangeMin: 700000,
      cohortRangeMax: 900000,
    },
  },
  error: null,
}

export const mockCompareInsufficient = {
  success: true,
  data: {
    snapshotYm: '202607',
    cohort: {
      assetRange: 10000000,
      ageRange: 2,
      cohortSize: 8,
      sufficient: false,
      minimumRequired: 30,
    },
    dealTypeDistribution: null,
    averageTargetAmount: null,
    averagePrepMonths: null,
    achievementDistribution: null,
    popularRegions: null,
    savingRange: null,
  },
  error: null,
}
