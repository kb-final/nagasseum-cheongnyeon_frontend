import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import MobileLayout from '@/layouts/MobileLayout.vue'

import { authRoutes } from '@/router/routes/auth.routes'
import { assetRoutes } from '@/router/routes/asset.routes'
import { useAuthStore } from '@/features/auth'
import { compareRoutes } from '@/router/routes/compare.routes'
import { homeRoutes } from '@/router/routes/home.routes'
import { placeholderRoutes } from '@/router/routes/placeholder.routes'

const AUTH_REQUIRED_ROUTE_NAMES = ['basic-info', 'asset-link', 'asset-auth', 'asset-syncing']

const routes = [
  {
    path: '/',
    component: MobileLayout,
    children: [...homeRoutes, ...compareRoutes, ...placeholderRoutes],
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
