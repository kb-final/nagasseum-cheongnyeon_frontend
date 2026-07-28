// CLAUDE.md ERD(goal, goalHousing, asset_summary)의 필드명에 맞춘 목업 데이터

export const mockActiveGoal = {
  id: 1,
}

// 목표 없는 경우 확인
// export const mockActiveGoal = null;

export const mockGoalSummary = {
  member: {
    nickname: '민지',
    level: 3,
    levelTitle: '등반가',
    hasUnreadNotification: true,
  },
  goal: {
    id: 1,
    housingType: '원룸',
    dealType: '전세',
    regionName: '서초구',
    targetAmount: 120000000,
    // 목표 설정 당시 매물 중앙값(설정 시점 고정값)
    targetRentMiddleAmount: 96000000,
    targetDate: '2028-03-31',
    monthlySaving: 450000,
    marketAlertDismissedAt: null,
    marketAlertDismissedPrice: null,
  },
  climb: {
    progressPercent: 27,
    remainingAmount: 87520000,
    recentIncreaseAmount: 1290000,
  },
  assetSummary: {
    totalAssets: 32480000,
    loanBalance: 0,
    monthlySavings: 450000,
    syncedAt: '2026-07-28T09:12:00+09:00',
  },
  // 매물 시세 변화 알림 카드용 데이터. initialMiddleAmount = goal.targetRentMiddleAmount(설정 당시 값)와 동일하지만
  // 카드가 goal 객체에 의존하지 않고 바로 그릴 수 있도록 값을 한 번 더 내려준다(백엔드가 집계해서 내려줄 형태 가정)
  marketAlert: {
    regionName: '강남구',
    housingType: '오피스텔',
    dealType: '전세',
    areaLabel: '10-20평',
    updatedYm: '2026-07',
    changeAmount: 30000000,
    targetAmount: 930000000,
    initialMiddleAmount: 960000000,
    currentMiddleAmount: 990000000,
    diffFromMedian: 60000000,
    // 목표를 유지/반영했을 때 각각 예상 달성 시점 비교용
    maintainEta: '2028-09',
    reflectEta: '2029-07',
  },
}

// 활성 목표가 없을 때 홈 화면 표시용 임시 데이터.
// CLAUDE.md API 표에는 없는 임시 엔드포인트(goals/home-summary)에서 사용 —
// 실제 백엔드에서 member/assetSummary를 목표와 독립적으로 조회할 방법이 확정되면 교체 필요.
export const mockHomeSummaryNoGoal = {
  member: mockGoalSummary.member,
  goal: null,
  climb: null,
  assetSummary: mockGoalSummary.assetSummary,
  marketAlert: mockGoalSummary.marketAlert,
}
