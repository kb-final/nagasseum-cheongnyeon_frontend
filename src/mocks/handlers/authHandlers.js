import { http, HttpResponse } from 'msw'

import { mockLoginResponse } from '@/mocks/data/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const authHandlers = [
  http.post(`${API_BASE_URL}/api/v1/auth/kakao`, () => {
    return HttpResponse.json(mockLoginResponse)
  }),
]
