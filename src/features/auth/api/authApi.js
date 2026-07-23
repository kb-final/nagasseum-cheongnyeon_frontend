import httpClient from '@/shared/api/httpClient'

export async function loginWithKakao() {
  const { data } = await httpClient.post('/api/v1/auth/kakao')
  return data
}
