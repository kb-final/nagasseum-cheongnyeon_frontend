import { http, HttpResponse } from 'msw'

import {
  createMockConnectionDeleteResponse,
  createMockConnectionResponse,
  mockAssetAccountsResponse,
  mockAssetConnectionsResponse,
  mockAssetSummaryResponse,
  mockConnectionFailureResponse,
  mockConnectionNotFoundResponse,
  mockManualAssetNotFoundResponse,
  mockManualAssetsResponse,
  mockOrganizationsResponse,
  setMockManualAssets,
} from '@/mocks/data/asset'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 목에서 인증 실패 흐름을 확인하려면 비밀번호에 이 값을 입력하세요.
const FAILURE_TEST_PASSWORD = 'wrong'

export const assetHandlers = [
  http.get(`${API_BASE_URL}/api/v1/assets/organizations`, () => {
    return HttpResponse.json(mockOrganizationsResponse)
  }),
  http.get(`${API_BASE_URL}/api/v1/assets/accounts/:memberId`, () => {
    return HttpResponse.json({ success: true, data: mockAssetAccountsResponse, error: null })
  }),
  http.post(`${API_BASE_URL}/api/v1/assets/sync`, () => {
    return HttpResponse.json({ success: true, data: null, error: null })
  }),
  http.post(`${API_BASE_URL}/api/v1/assets/connections`, async ({ request }) => {
    const body = await request.json()

    if (body.password === FAILURE_TEST_PASSWORD) {
      return HttpResponse.json(mockConnectionFailureResponse, { status: 400 })
    }

    return HttpResponse.json(createMockConnectionResponse(body.organizationCode))
  }),
  http.get(`${API_BASE_URL}/api/v1/assets/summary/:memberId`, () => {
    return HttpResponse.json({ success: true, data: mockAssetSummaryResponse, error: null })
  }),
  http.get(`${API_BASE_URL}/api/v1/assets/connections`, () => {
    return HttpResponse.json(mockAssetConnectionsResponse)
  }),
  http.delete(
    `${API_BASE_URL}/api/v1/assets/connections/organizations/:organizationCode`,
    ({ params }) => {
      const isConnected = mockAssetConnectionsResponse.data.some(
        (item) => item.organizationCode === params.organizationCode,
      )
      if (!isConnected) {
        return HttpResponse.json(mockConnectionNotFoundResponse, { status: 404 })
      }

      return HttpResponse.json(createMockConnectionDeleteResponse(params.organizationCode))
    },
  ),
  http.get(`${API_BASE_URL}/api/v1/assets/manual/:memberId`, () => {
    return HttpResponse.json({ success: true, data: mockManualAssetsResponse, error: null })
  }),
  http.post(`${API_BASE_URL}/api/v1/assets/manual`, async ({ request }) => {
    const { assetType, amount } = await request.json()
    const now = new Date().toISOString()
    const created = {
      id: Math.max(0, ...mockManualAssetsResponse.map((asset) => asset.id)) + 1,
      assetType,
      amount,
      createdAt: now,
      updatedAt: now,
    }

    setMockManualAssets([...mockManualAssetsResponse, created])

    return HttpResponse.json({ success: true, data: created, error: null }, { status: 201 })
  }),
  http.put(`${API_BASE_URL}/api/v1/assets/manual/:id`, async ({ request, params }) => {
    const id = Number(params.id)
    const target = mockManualAssetsResponse.find((asset) => asset.id === id)
    if (!target) {
      return HttpResponse.json(mockManualAssetNotFoundResponse, { status: 404 })
    }

    const { assetType, amount } = await request.json()
    const updated = { ...target, assetType, amount, updatedAt: new Date().toISOString() }
    setMockManualAssets(
      mockManualAssetsResponse.map((asset) => (asset.id === id ? updated : asset)),
    )

    return HttpResponse.json({ success: true, data: updated, error: null })
  }),
  http.delete(`${API_BASE_URL}/api/v1/assets/manual/:id`, ({ params }) => {
    const id = Number(params.id)
    const exists = mockManualAssetsResponse.some((asset) => asset.id === id)
    if (!exists) {
      return HttpResponse.json(mockManualAssetNotFoundResponse, { status: 404 })
    }

    setMockManualAssets(mockManualAssetsResponse.filter((asset) => asset.id !== id))

    return HttpResponse.json({ success: true, data: null, error: null })
  }),
]
