import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/main.css'
import App from './App.vue'
import router from './router'

import { registerAuthRefreshInterceptor } from '@/features/auth'

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK !== 'true') return

  const { worker } = await import('@/mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

registerAuthRefreshInterceptor()

enableMocking().then(() => {
  createApp(App).use(createPinia()).use(router).mount('#app')
})
