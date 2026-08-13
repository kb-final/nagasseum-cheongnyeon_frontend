import { DiagnosisView, GoalDetailView, GoalEmptyView } from '@/features/goal'

export const goalRoutes = [
  { path: 'diagnosis', name: 'diagnosis', component: DiagnosisView },
  { path: 'goals', name: 'goal-empty', component: GoalEmptyView },
  // 목표 수정은 진단 폼(UC-12)을 그대로 재사용하되, goalId가 있으면 생성(POST)이 아니라
  // 수정(PUT)으로 저장한다. 쿼리가 아니라 경로로 둬야 goalId가 빠진 주소가 아예 성립하지 않아,
  // 수정하려던 요청이 조용히 생성으로 새어나가지 않는다.
  { path: 'goals/:goalId/edit', name: 'goal-edit', component: DiagnosisView, props: true },
  { path: 'goals/:goalId', name: 'goal-detail', component: GoalDetailView, props: true },
]
