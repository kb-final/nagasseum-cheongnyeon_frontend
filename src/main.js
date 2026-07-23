import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/main.css'
import App from './App.vue'
import router from './router'

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK !== 'true') return

  const { worker } = await import('@/mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking().then(() => {
  createApp(App).use(createPinia()).use(router).mount('#app')
})
