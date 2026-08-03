import { http, HttpResponse } from 'msw'

import {
  createMockConnectionResponse,
  createMockManualAssetResponse,
  mockConnectionFailureResponse,
  mockOrganizationsResponse,
} from '@/mocks/data/asset'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 목에서 인증 실패 흐름을 확인하려면 비밀번호에 이 값을 입력하세요.
const FAILURE_TEST_PASSWORD = 'wrong'

export const assetHandlers = [
  http.get(`${API_BASE_URL}/api/v1/assets/organizations`, () => {
    return HttpResponse.json(mockOrganizationsResponse)
  }),
  http.post(`${API_BASE_URL}/api/v1/assets/connections`, async ({ request }) => {
    const body = await request.json()

    if (body.password === FAILURE_TEST_PASSWORD) {
      return HttpResponse.json(mockConnectionFailureResponse, { status: 400 })
    }

    return HttpResponse.json(createMockConnectionResponse(body.organizationCode))
  }),
  http.post(`${API_BASE_URL}/api/v1/assets/manual`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(createMockManualAssetResponse(body))
  }),
]
