import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import MobileLayout from '@/layouts/MobileLayout.vue'

import { authRoutes } from '@/router/routes/auth.routes'
import { assetRoutes } from '@/router/routes/asset.routes'
import { useAuthStore } from '@/features/auth'
import { compareRoutes } from '@/router/routes/compare.routes'
import { homeRoutes } from '@/router/routes/home.routes'
import { goalRoutes } from '@/router/routes/goal.routes'
import { placeholderRoutes } from '@/router/routes/placeholder.routes'

const AUTH_REQUIRED_ROUTE_NAMES = ['basic-info', 'asset-link', 'asset-auth', 'asset-syncing']

const routes = [
  // MobileLayout이 DefaultLayout보다 먼저 와야 한다: 두 라우트 모두 path가 '/'로 같은데
  // DefaultLayout은 children이 비어 있어도 그 자체로 '/'와 매치되므로, 순서가 바뀌면
  // '/'가 항상 빈 DefaultLayout으로만 렌더링되고 homeRoutes(홈 화면)에 도달하지 못한다.
  {
    path: '/',
    component: MobileLayout,
    children: [...homeRoutes, ...goalRoutes, ...placeholderRoutes],
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      // 도메인별 라우트는 src/router/routes/{domain}.routes.js 에서 추가합니다.
      ...compareRoutes,
    ],
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
  if (!AUTH_REQUIRED_ROUTE_NAMES.includes(to.name)) return true

  const authStore = useAuthStore()
  if (!authStore.user) return { name: 'login' }

  return true
})

export default router
