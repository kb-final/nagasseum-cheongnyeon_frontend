import { DiagnosisView, GoalDetailView } from '@/features/goal'

export const goalRoutes = [
  { path: 'diagnosis', name: 'diagnosis', component: DiagnosisView },
  { path: 'goals/:goalId', name: 'goal-detail', component: GoalDetailView, props: true },
]
