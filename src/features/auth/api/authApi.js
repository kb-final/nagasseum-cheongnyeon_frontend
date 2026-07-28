import httpClient from '@/shared/api/httpClient'

export async function loginWithKakao() {
  const { data } = await httpClient.post('/api/v1/auth/kakao')
  return data
}

export async function updateBasicInfo(memberId, basicInfo) {
  const { data } = await httpClient.patch(`/api/v1/members/${memberId}`, basicInfo)
  return data
}
