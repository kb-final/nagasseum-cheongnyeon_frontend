import { http, HttpResponse } from 'msw'

import { mockActiveGoal, mockGoalSummary, mockHomeSummaryNoGoal } from '@/mocks/data/home'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const homeHandlers = [
  http.get(`${API_BASE_URL}/api/v1/goals/active`, () => {
    return HttpResponse.json(mockActiveGoal)
  }),
  http.get(`${API_BASE_URL}/api/v1/goals/:goalId/summary`, () => {
    return HttpResponse.json(mockGoalSummary)
  }),
  // 활성 목표가 없을 때 홈 화면용 임시 엔드포인트(CLAUDE.md API 표에는 없음)
  http.get(`${API_BASE_URL}/api/v1/goals/home-summary`, () => {
    return HttpResponse.json(mockHomeSummaryNoGoal)
  }),
]
