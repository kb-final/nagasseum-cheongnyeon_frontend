import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import MobileLayout from '@/layouts/MobileLayout.vue'

import { authRoutes } from '@/router/routes/auth.routes'
import { assetRoutes } from '@/router/routes/asset.routes'
import { useAuthStore } from '@/features/auth'
import { compareRoutes } from '@/router/routes/compare.routes'
import { homeRoutes } from '@/router/routes/home.routes'
import { goalRoutes } from '@/router/routes/goal.routes'
import { placeholderRoutes } from '@/router/routes/placeholder.routes'

const AUTH_REQUIRED_ROUTE_NAMES = [
  'basic-info',
  'asset-link',
  'asset-auth',
  'asset-syncing',
  'home',
  'compare',
]

// 로컬 개발 전용. 각 화면을 로그인 없이 바로 확인하기 위한 우회이며, 프로덕션 빌드에서는 반드시 꺼져 있어야 한다.
const SKIP_AUTH_GUARD = import.meta.env.VITE_SKIP_AUTH_GUARD === 'true'

const routes = [
  {
    path: '/',
    component: MobileLayout,
    children: [...homeRoutes, ...gaolRoutes, ...compareRoutes, ...placeholderRoutes],
  },
  {
    path: '/',
    component: AuthLayout,
    children: [...authRoutes, ...assetRoutes],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  if (SKIP_AUTH_GUARD) return true
  if (!AUTH_REQUIRED_ROUTE_NAMES.includes(to.name)) return true

  const authStore = useAuthStore()
  if (!authStore.user) return { name: 'login' }

  return true
})

export default router
