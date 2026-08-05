import httpClient from '@/shared/api/httpClient'

export async function getAssetOrganizations() {
  const { data } = await httpClient.get('/api/v1/assets/organizations')
  return data
}

// 계좌 목록 조회: 연동된 금융기관의 자산 계좌·대출 계좌 목록을 기관별로 그룹화하여 반환
export async function getAssetAccounts() {
  const { data } = await httpClient.get('/api/v1/assets/accounts')
  return data
}

// 자산 동기화: 연동된 모든 기관의 계좌 정보를 CODEF에서 다시 조회해 DB에 반영
export async function syncAssets() {
  const { data } = await httpClient.post('/api/v1/assets/sync')
  return data
}

// 자산 요약 조회: 총자산·총부채·순자산과 현금성/투자 자산 구성을 최신 동기화 값 기준으로 한 번에 조회
export async function getAssetSummary() {
  const { data } = await httpClient.get('/api/v1/assets/summary')
  return data
}

// 연동 기관 목록 조회: 현재 사용자에게 연동된 금융기관 목록을 조회
export async function getConnectedAssetOrganizations() {
  const { data } = await httpClient.get('/api/v1/assets/connections')
  return data
}

// 연동 기관 삭제: 연동된 특정 금융기관을 CODEF에서 해제하고 관련 자산 데이터를 삭제
export async function deleteAssetConnection(organizationCode) {
  const { data } = await httpClient.delete(
    `/api/v1/assets/connections/organizations/${organizationCode}`,
  )
  return data
}

// 수동 자산 목록 조회: CODEF로 연동할 수 없는 자산(예: 현재 거주 보증금)을 회원이 직접 등록한 목록
export async function getManualAssets() {
  const { data } = await httpClient.get('/api/v1/assets/manual')
  return data
}

// 수동 자산 등록
export async function createManualAsset({ assetType, amount }) {
  const { data } = await httpClient.post('/api/v1/assets/manual', { assetType, amount })
  return data
}

// 수동 자산 수정
export async function updateManualAsset(id, { assetType, amount }) {
  const { data } = await httpClient.put(`/api/v1/assets/manual/${id}`, { assetType, amount })
  return data
}

// 수동 자산 삭제
export async function deleteManualAsset(id) {
  const { data } = await httpClient.delete(`/api/v1/assets/manual/${id}`)
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
