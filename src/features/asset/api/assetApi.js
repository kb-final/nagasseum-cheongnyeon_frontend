import httpClient from '@/shared/api/httpClient'

export async function getAssetOrganizations() {
  const { data } = await httpClient.get('/api/v1/assets/organizations')
  return data
}

// 계좌 목록 조회: 연동된 금융기관의 자산 계좌·대출 계좌 목록을 기관별로 그룹화하여 반환
export async function getAssetAccounts(memberId) {
  const { data } = await httpClient.get(`/api/v1/assets/accounts/${memberId}`)
  return data
}

// 자산 동기화: 연동된 모든 기관의 계좌 정보를 CODEF에서 다시 조회해 DB에 반영
export async function syncAssets() {
  const { data } = await httpClient.post('/api/v1/assets/sync')
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
