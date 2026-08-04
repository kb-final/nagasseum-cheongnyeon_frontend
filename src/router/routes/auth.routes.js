import {
  LoginView,
  CallbackLoginView,
  CallbackSignupView,
  BasicInfoView,
  DepositInfoView,
} from '@/features/auth'

export const authRoutes = [
  {
    path: '',
    redirect: { name: 'login' },
  },
  {
    path: 'login',
    name: 'login',
    component: LoginView,
  },
  {
    path: 'callback',
    name: 'callback-login',
    component: CallbackLoginView,
  },
  {
    path: 'callback/signup',
    name: 'callback-signup',
    component: CallbackSignupView,
  },
  {
    path: 'basic-info',
    name: 'basic-info',
    component: BasicInfoView,
  },
  {
    path: 'deposit-info',
    name: 'deposit-info',
    component: DepositInfoView,
  },
]
