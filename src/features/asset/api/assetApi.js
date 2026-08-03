import httpClient from '@/shared/api/httpClient'

export async function getAssetOrganizations() {
  const { data } = await httpClient.get('/api/v1/assets/organizations')
  return data
}

export async function getAssetDetail() {
  const { data } = await httpClient.get('/api/v1/assets/detail')
  return data
}

const LOGIN_TYPE_ID = 'ID'

// RSA 공개키 도입 전 평문으로 전송
export async function linkAssetConnection({ organizationCode, id, password, birthDate }) {
  const { data } = await httpClient.post('/api/v1/assets/connections', {
    organizationCode,
    loginType: LOGIN_TYPE_ID,
    id,
    password,
    birthDate,
  })
  return data
}
