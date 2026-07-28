import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { authRoutes } from '@/router/routes/auth.routes'
import { compareRoutes } from '@/router/routes/compare.routes'

const routes = [
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
    children: authRoutes,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
