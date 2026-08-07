import { DiagnosisView, GoalDetailView, GoalEmptyView } from '@/features/goal'

export const goalRoutes = [
  { path: 'diagnosis', name: 'diagnosis', component: DiagnosisView },
  { path: 'goals', name: 'goal-empty', component: GoalEmptyView },
  { path: 'goals/:goalId', name: 'goal-detail', component: GoalDetailView, props: true },
]
