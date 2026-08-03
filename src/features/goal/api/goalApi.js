import httpClient from '@/shared/api/httpClient'

// 희망 주거 조건 입력 -> 자산 기반 총예산 계산 -> 시세 위치/예산 부족 여부/조정 제안 반환
// 이 엔드포인트는 CLAUDE.md가 명시한 {success,data,error} 래퍼를 그대로 따르므로 여기서 언래핑한다.
// (다른 goal API의 언래핑 미구현 이슈와는 별개로, 이 응답 계약에 한해 대응)
export async function postGoalDiagnosis(payload) {
  const { data } = await httpClient.post('/api/v1/goals/diagnosis', payload)
  return data.data
}

// 목표 상세 화면 데이터 (목표 정보 · 달성 현황 · 저축 현황 · 예상 달성 시점)
export async function fetchGoalDetail(goalId) {
  const { data } = await httpClient.get(`/api/v1/goals/${goalId}/detail`)
  return data.data
}

// 기존 목표 내용 조회. 상세 조회(detail)와 달리 수정 폼 재현에 필요한 원본 입력값
// (특히 housing.regions 지역 "코드" 배열)을 내려주므로, 목표 수정 요청 본문을 만들 때 사용한다.
export async function fetchGoal(goalId) {
  const { data } = await httpClient.get(`/api/v1/goals/${goalId}`)
  return data.data
}

// 목표 수정. 부분 수정(PATCH)이 아니라 전체 교체(PUT)라 목표/주거 조건 전체를 함께 보내야 한다.
export async function putGoal(goalId, payload) {
  const { data } = await httpClient.put(`/api/v1/goals/${goalId}`, payload)
  return data.data
}

// 진단 결과 팝업에서 "이 목표로 설정" 선택 시 목표를 저장한다.
export async function postGoal(payload) {
  const { data } = await httpClient.post('/api/v1/goals', payload)
  return data.data
}
