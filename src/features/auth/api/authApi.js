import httpClient from '@/shared/api/httpClient'

export async function getKakaoCallback(code) {
  const { data } = await httpClient.get('/api/v1/oauth/kakao/callback', {
    params: { code },
  })
  return data.data
}

export async function signupWithKakao(signupInfo) {
  const { data } = await httpClient.post('/api/v1/oauth/kakao/signup', signupInfo)
  return data.data
}
