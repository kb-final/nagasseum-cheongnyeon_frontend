export const mockLoginResponse = {
  accessToken: 'mock-access-token',
  user: {
    id: 1,
    profileImage: 'https://placehold.co/80x80',
  },
}

export function createMockBasicInfoResponse(memberId, basicInfo) {
  return {
    user: {
      id: Number(memberId),
      ...basicInfo,
      profileImage: 'https://placehold.co/80x80',
    },
  }
}
