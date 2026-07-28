import httpClient from '@/shared/api/httpClient'

export async function getGoalComparison({ assetRange, ageRange } = {}) {
  const { data } = await httpClient.get('/api/v1/goals/comparison', {
    params: { assetRange, ageRange },
  })
  return data
}
