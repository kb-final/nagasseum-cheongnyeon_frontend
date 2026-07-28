import { http, HttpResponse } from 'msw'

import { mockOrganizationsResponse } from '@/mocks/data/asset'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const assetHandlers = [
  http.get(`${API_BASE_URL}/api/v1/assets/organizations`, () => {
    return HttpResponse.json(mockOrganizationsResponse)
  }),
]
