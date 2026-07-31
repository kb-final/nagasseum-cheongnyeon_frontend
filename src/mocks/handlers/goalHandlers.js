import { http, HttpResponse } from 'msw'

import { buildMockDiagnosisResult, mockGoalSaveResponse, mockGoalDetail } from '@/mocks/data/goal'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const goalHandlers = [
  http.post(`${API_BASE_URL}/api/v1/goals/diagnosis`, async ({ request }) => {
    const payload = await request.json()
    return HttpResponse.json({
      success: true,
      data: buildMockDiagnosisResult(payload),
      error: null,
    })
  }),

  http.post(`${API_BASE_URL}/api/v1/goals`, async ({ request }) => {
    await request.json()
    return HttpResponse.json({ success: true, data: mockGoalSaveResponse, error: null })
  }),

  http.get(`${API_BASE_URL}/api/v1/goals/:goalId/detail`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { ...mockGoalDetail, goalId: Number(params.goalId) },
      error: null,
    })
  }),
]
