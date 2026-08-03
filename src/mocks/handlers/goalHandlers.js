import { http, HttpResponse } from 'msw'

import {
  buildMockDiagnosisResult,
  mockGoalSaveResponse,
  mockGoalDetail,
  mockGoal,
  applyMockGoalUpdate,
} from '@/mocks/data/goal'

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

  // 주의: `/goals/active`, `/goals/home-summary`(homeHandlers)와 경로 모양이 겹친다.
  // MSW는 먼저 등록된 핸들러가 이기므로 handlers/index.js에서 homeHandlers가 goalHandlers보다 앞에 있어야 한다.
  http.get(`${API_BASE_URL}/api/v1/goals/:goalId`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { ...mockGoal, goalId: Number(params.goalId) },
      message: '목표 조회 성공',
      error: null,
    })
  }),

  http.put(`${API_BASE_URL}/api/v1/goals/:goalId`, async ({ request, params }) => {
    const payload = await request.json()
    applyMockGoalUpdate(payload)

    return HttpResponse.json({
      success: true,
      data: { goalId: Number(params.goalId), updatedAt: new Date().toISOString() },
      message: '목표 수정 성공',
      error: null,
    })
  }),

  http.get(`${API_BASE_URL}/api/v1/goals/:goalId/detail`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { ...mockGoalDetail, goalId: Number(params.goalId) },
      error: null,
    })
  }),
]
