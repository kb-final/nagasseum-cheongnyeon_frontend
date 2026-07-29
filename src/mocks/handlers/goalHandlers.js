import { http, HttpResponse } from 'msw'

import { mockDiagnosisOptions } from '@/mocks/data/goal'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const goalHandlers = [
  http.post(`${API_BASE_URL}/api/v1/goals/diagnosis`, async ({ request }) => {
    await request.json()
    return HttpResponse.json(mockDiagnosisOptions)
  }),
]
