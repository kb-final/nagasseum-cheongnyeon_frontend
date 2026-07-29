import { http, HttpResponse } from 'msw'

import { mockLoginResponse, createMockBasicInfoResponse } from '@/mocks/data/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const authHandlers = [
  http.post(`${API_BASE_URL}/api/v1/auth/kakao`, () => {
    return HttpResponse.json(mockLoginResponse)
  }),
  http.patch(`${API_BASE_URL}/api/v1/members/:memberId`, async ({ request, params }) => {
    const basicInfo = await request.json()
    return HttpResponse.json(createMockBasicInfoResponse(params.memberId, basicInfo))
  }),
]
