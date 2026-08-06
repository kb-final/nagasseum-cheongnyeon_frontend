import httpClient from '@/shared/api/httpClient'

// 정책 추천은 아직 실제 도메인 담당자의 API가 확정되지 않은 임시 엔드포인트
export async function fetchRecommendedPolicies() {
  const { data } = await httpClient.get('/api/v1/policies/recommended')
  return data
}
