<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const SYNC_DISPLAY_DURATION_MS = 1800

const router = useRouter()
let redirectTimer = null

onMounted(() => {
  redirectTimer = setTimeout(() => {
    try {
      router.push({ name: 'home' })
    } catch {
      // TODO: home 라우트가 추가되면 제거. vue-router가 미등록 라우트 이름에 동기적으로 예외를 던짐
    }
  }, SYNC_DISPLAY_DURATION_MS)
})

onUnmounted(() => {
  clearTimeout(redirectTimer)
})
</script>

<template>
  <div class="asset-syncing-view">
    <div class="asset-syncing-view__spinner" />
    <h2 class="asset-syncing-view__title">고도를 측정하고 있어요</h2>
    <p class="asset-syncing-view__subtitle">연동한 기관의 자산 정보를 안전하게 받아오고 있어요</p>
  </div>
</template>

<style scoped>
.asset-syncing-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  min-height: 600px;
  padding: 64px 24px;
  text-align: center;
}

.asset-syncing-view__spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-toggle-off, #383e3a);
  border-top-color: var(--color-mint-strong, #c1e8c8);
  border-radius: 50%;
  animation: asset-syncing-spin 0.8s linear infinite;
}

.asset-syncing-view__title {
  margin: 0;
  font-size: 15.9px;
  font-weight: 500;
  color: var(--text-h, #ffffff);
}

.asset-syncing-view__subtitle {
  margin: 0;
  font-size: 13.1px;
  color: var(--text, #9aa09a);
}

@keyframes asset-syncing-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
