import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/main.css'
import App from './App.vue'
import router from './router'

import { registerAuthRefreshInterceptor } from '@/features/auth'
import { trackStore } from '@/shared/utils/storeRegistry'
import { initTheme } from '@/shared/composables/useTheme'

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK !== 'true') return

  const { worker } = await import('@/mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

// 첫 페인트 전에 data-theme을 세팅해야 테마 깜빡임(FOUC)이 없다.
initTheme()
registerAuthRefreshInterceptor()

const pinia = createPinia()
pinia.use(trackStore)

enableMocking().then(() => {
  createApp(App).use(pinia).use(router).mount('#app')
})
