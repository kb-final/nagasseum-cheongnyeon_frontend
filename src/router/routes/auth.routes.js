import { LoginView, BasicInfoView } from '@/features/auth'

export const authRoutes = [
  {
    path: 'login',
    name: 'login',
    component: LoginView,
  },
  {
    path: 'basic-info',
    name: 'basic-info',
    component: BasicInfoView,
  },
]
