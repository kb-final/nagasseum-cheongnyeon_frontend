import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { authRoutes } from '@/router/routes/auth.routes'
import { assetRoutes } from '@/router/routes/asset.routes'
import { useAuthStore } from '@/features/auth'

const AUTH_REQUIRED_ROUTE_NAMES = ['basic-info', 'asset-link']

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      // 도메인별 라우트는 src/router/routes/{domain}.routes.js 에서 추가합니다.
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
