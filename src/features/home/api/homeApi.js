import httpClient from '@/shared/api/httpClient'

// 활성 목표(status=ACTIVE) 존재 여부/식별자 조회. 목표가 없으면 null 등 falsy 값이 온다고 가정
export async function fetchActiveGoal() {
  const { data } = await httpClient.get('/api/v1/goals/active')
  return data
}

// 홈(메인) 화면에 필요한 목표/자산/시세 요약 데이터
export async function fetchGoalSummary(goalId) {
  const { data } = await httpClient.get(`/api/v1/goals/${goalId}/summary`)
  return data
}

// 활성 목표가 없을 때 홈 화면에 필요한 회원/자산/시세 데이터.
// CLAUDE.md API 표에는 없는 임시 엔드포인트 — 실제 백엔드 계약 확정 시 교체 필요.
export async function fetchHomeSummary() {
  const { data } = await httpClient.get('/api/v1/goals/home-summary')
  return data
}

// 정책 추천/자산 세부내역은 아직 실제 도메인 담당자의 API가 확정되지 않은 임시 엔드포인트
export async function fetchRecommendedPolicies() {
  const { data } = await httpClient.get('/api/v1/policies/recommended')
  return data
}

export async function fetchAssetBreakdown() {
  const { data } = await httpClient.get('/api/v1/assets/breakdown')
  return data
}
