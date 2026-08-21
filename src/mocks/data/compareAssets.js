// 또래 비교 — 자산 탭.
// 페르소나는 월 소득 210만원(8~9분위), 직업군 회사원, 월 저축 70만원.
// 소득 구간과 직업군 분포에서 내 깃발이 꽂히는 위치가 화면의 포인트다.
export const mockCompareAssetsSuccess = {
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
    saving: {
      mine: 700000,
      cohortMin: 300000,
      cohortMax: 1100000,
    },
    incomeBracketDistribution: [
      { bracket: 'INCOME_DECILE_1', ratio: 6.6 },
      { bracket: 'INCOME_DECILE_2_3', ratio: 21.3 },
      { bracket: 'INCOME_DECILE_4_5', ratio: 24.6 },
      { bracket: 'INCOME_DECILE_6_7', ratio: 19.7 },
      // 페르소나가 속한 구간.
      { bracket: 'INCOME_DECILE_8_9', ratio: 18.0 },
      { bracket: 'INCOME_DECILE_10', ratio: 6.6 },
      { bracket: 'UNKNOWN', ratio: 3.2 },
    ],
    occupationDistribution: [
      { occupationType: '회사원', ratio: 58.5 },
      { occupationType: '취업 준비', ratio: 14.8 },
      { occupationType: '프리랜서', ratio: 13.1 },
      { occupationType: '공무원·공공기관', ratio: 8.2 },
      { occupationType: '기타', ratio: 5.4 },
    ],
  },
  error: null,
}

// 목표가 없는 사용자. saving.mine은 목표에 종속된 값이라 null — 자산 탭에서 저축액 카드 대신
// "목표를 세우면 저축 계획도 비교할 수 있어요" 잠금 카드로 대체되는지 확인할 때 쓴다.
export const mockCompareAssetsNoGoal = {
  success: true,
  data: {
    ...mockCompareAssetsSuccess.data,
    saving: {
      mine: null,
      cohortMin: 300000,
      cohortMax: 1100000,
    },
  },
  error: null,
}

export const mockCompareAssetsInsufficient = {
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
    saving: null,
    incomeBracketDistribution: null,
    occupationDistribution: null,
  },
  error: null,
}

// 자산 연동이 없는 사용자. 필요할 때 핸들러에서 수동으로 바꿔 끼운다.
export const mockCompareAssetsAssetRequired = {
  success: false,
  data: null,
  error: { code: 'COMPARE_ASSET_REQUIRED', message: '자산 연동이 필요합니다.' },
}
