import { http, HttpResponse } from 'msw'

import {
  buildMockDiagnosisResult,
  mockGoalSaveResponse,
  mockGoalDetail,
  mockGoal,
  applyMockGoalUpdate,
  mockSavingSimulations,
  mockGoalMarketTrend,
  mockGoalSummaryHome,
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

  http.get(`${API_BASE_URL}/api/v1/goals/:goalId/simulations/monthly-saving`, ({ request }) => {
    const monthlySaving = Number(new URL(request.url).searchParams.get('monthlySaving'))

    if (!Number.isFinite(monthlySaving) || monthlySaving <= 0) {
      return HttpResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: { code: 'GOAL_INVALID_INPUT', message: '월 저축액은 0보다 커야 합니다.' },
        },
        { status: 400 },
      )
    }

    const simulation = mockSavingSimulations[monthlySaving]

    // 목 데이터가 없는 금액. 실제 API가 붙으면 임의 금액도 모두 계산되므로 이 분기는 사라진다.
    if (!simulation) {
      return HttpResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: {
            code: 'SIMULATION_MOCK_NOT_FOUND',
            message: `목 데이터가 준비된 금액이 아닙니다. (준비된 금액: ${Object.keys(mockSavingSimulations).join(', ')})`,
          },
        },
        { status: 404 },
      )
    }

    return HttpResponse.json({
      success: true,
      data: simulation,
      message: '월 저축액 변경 시 예상 달성 시점 조회 성공',
      error: null,
    })
  }),

  // 홈 화면 매물 시세 변화 카드. 아래 `/goals/:goalId`가 `market-trend`도 goalId로 매칭해버리므로
  // 반드시 그보다 먼저 등록해야 한다(MSW는 먼저 등록된 핸들러가 이긴다).
  http.get(`${API_BASE_URL}/api/v1/goals/market-trend`, () => {
    return HttpResponse.json({ success: true, data: mockGoalMarketTrend, error: null })
  }),

  // 홈 화면 목표 달성 요약 카드. 마찬가지로 `/goals/:goalId`보다 먼저 등록해야 한다.
  http.get(`${API_BASE_URL}/api/v1/goals/summary`, () => {
    return HttpResponse.json({ success: true, data: mockGoalSummaryHome, error: null })
  }),

  // 주의: 아래 `/goals/:goalId`는 세그먼트 하나짜리 경로는 모두 goalId로 매칭하므로,
  // `market-trend`/`summary`처럼 고정 경로를 쓰는 핸들러는 항상 이보다 먼저 등록해야 한다.
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
