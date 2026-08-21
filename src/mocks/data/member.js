/**
 * 시연 영상 촬영용 씬 스위치.
 *
 * 목 환경에서는 계정을 여러 개 만들 수 없어, 이 상수 하나로 화면 상태를 갈아끼운다.
 * 값을 바꾸고 브라우저를 새로고침하면 된다.
 *
 * - 'NO_GOAL'  : 챕터 ③ — 자산은 연동됐지만 목표가 없다. 홈이 'NEW QUEST · 아직 오를 정상이 없어요'
 * - 'GOAL_SET' : 챕터 ⑥ 끝 — 목표를 막 저장한 직후. 달성률 65.5%
 * - 'AFTER_3M' : 챕터 ⑦⑧⑨ — 3개월 뒤. 자산·달성률 상승, 시세 변동 반영. 달성률 70.5%
 *
 * 촬영 순서(④⑤⑥ → ⑦⑧⑨ → ③ → ②)에 맞춰 AFTER_3M → GOAL_SET → NO_GOAL 순으로 바꿔가며 찍으면
 * 스위치를 두 번만 만지면 된다.
 */
// export const SCENE = 'AFTER_3M'
export const SCENE = 'NO_GOAL'

export const isNoGoal = SCENE === 'NO_GOAL'
export const isGoalSet = SCENE === 'GOAL_SET'
export const isAfter3M = SCENE === 'AFTER_3M'

/**
 * 페르소나. 여기만 고치면 홈 인사말·마이페이지·회원가입 목이 한 번에 따라온다.
 * 25세, 입사 6개월 차 신입. 마포구 오피스텔 전세 10~20평 / 2029년 8월 / 월 저축 70만원.
 */
export const PERSONA = {
  nickname: '지우',
  birthDate: '010412', // 2001-04-12 → 만 25세
  monthlyIncome: 2_100_000,
  incomeBracket: 'INCOME_DECILE_8_9',
  occupationType: 'OFFICE_WORKER',
}

export const mockMemberProfile = {
  id: 1,
  nickname: PERSONA.nickname,
  incomeBracket: PERSONA.incomeBracket,
  monthlyIncome: PERSONA.monthlyIncome,
  occupationType: PERSONA.occupationType,
  notificationAgreed: true,
  // 시연 챕터 ⑧이 "잠금 화면 → 약관 동의 → 해제" 순으로 진행되므로 반드시 false로 시작한다.
  // 리허설로 토글을 켰다면 새로고침하면 이 값으로 돌아온다.
  compareDataAgreed: false,
}

export const mockAgreementNotFoundResponse = {
  success: false,
  data: null,
  error: {
    code: 'AGREEMENT_NOT_FOUND',
    message: '존재하지 않는 동의 항목입니다.',
  },
}

export const mockMemberNotFoundResponse = {
  success: false,
  data: null,
  error: {
    code: 'MEMBER_001',
    message: '회원을 찾을 수 없습니다.',
  },
}
