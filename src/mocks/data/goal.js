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
