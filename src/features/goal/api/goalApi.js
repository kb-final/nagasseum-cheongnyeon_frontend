import httpClient from '@/shared/api/httpClient'

// 희망 주거 조건 입력 -> 자산 기반 총예산 계산 -> 달성 가능한 목표 옵션 목록 반환
// 주의: {success,data,error} 언래핑 및 401 재발급 흐름은 공용 계층(httpClient/errorHandler)에
// 아직 구현되어 있지 않음 — homeApi.js와 동일하게 axios 응답의 data를 그대로 페이로드로 사용한다.
// CLAUDE.md가 명시한 응답 래퍼 스펙과의 괴리는 기존부터 있던 이슈이며, 추후 공용 계층 정리 필요.
export async function postGoalDiagnosis(payload) {
  const { data } = await httpClient.post('/api/v1/goals/diagnosis', payload)
  return data
}

// TODO(후속 작업): 진단 결과 옵션 선택 후 POST /api/v1/goals로 저장하는 로직은
// 결과 목록 화면과 함께 별도로 구현한다 (이번 스코프는 진단 입력 폼까지).
