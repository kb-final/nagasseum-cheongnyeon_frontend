export const mockKakaoSignupRequiredResponse = {
  success: true,
  data: {
    status: 'SIGNUP_REQUIRED',
    accessToken: null,
    refreshToken: null,
    memberId: null,
    kakaoId: '1234567890',
    kakaoNickname: '김OO',
  },
  error: null,
}

export const mockKakaoLoginResponse = {
  success: true,
  data: {
    status: 'LOGIN',
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    memberId: 1,
    kakaoId: null,
    kakaoNickname: null,
  },
  error: null,
}

export const mockKakaoSignupResponse = {
  success: true,
  data: {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    memberId: 1,
  },
  error: null,
}
