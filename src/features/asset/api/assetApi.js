import httpClient from '@/shared/api/httpClient'

export async function getAssetOrganizations() {
  const { data } = await httpClient.get('/api/v1/assets/organizations')
  return data
}
