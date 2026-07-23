<script setup>
import { ref } from 'vue'

import BaseButton from '@/shared/components/BaseButton.vue'

import { useAuthStore } from '@/features/auth/store/authStore'

const authStore = useAuthStore()
const isLoading = ref(false)
const errorMessage = ref('')

async function handleKakaoLogin() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.loginWithKakaoAccount()
  } catch {
    errorMessage.value = '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-view">
    <div class="login-view__intro">
      <div class="login-view__logo">🏠</div>
      <h1 class="login-view__title">내집마련 청년</h1>
      <p class="login-view__subtitle">내 집 마련까지, 한 걸음씩</p>
    </div>

    <p v-if="authStore.user" class="login-view__result">
      {{ authStore.user.nickname }}님, 환영합니다! (MSW 목 응답)
    </p>

    <div class="login-view__action">
      <BaseButton :disabled="isLoading" @click="handleKakaoLogin">
        {{ isLoading ? '로그인 중...' : '카카오로 3초만에 시작하기' }}
      </BaseButton>
      <p v-if="errorMessage" class="login-view__error">{{ errorMessage }}</p>
      <p class="login-view__terms">가입 시 이용약관 및 개인정보처리방침에 동의합니다</p>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  width: 100%;
  max-width: 360px;
  min-height: 600px;
  padding: 64px 24px;
}

.login-view__intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: auto;
}

.login-view__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #e3f6e8;
  font-size: 28px;
}

.login-view__title {
  font-size: 24px;
  font-weight: 700;
}

.login-view__subtitle {
  font-size: 14px;
  color: var(--muted, #8a8a8f);
}

.login-view__result {
  font-size: 14px;
  color: var(--accent, #aa3bff);
}

.login-view__action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-top: auto;
}

.login-view__action :deep(.base-button) {
  width: 100%;
  padding: 14px;
  font-weight: 700;
  background: #fee500;
  color: #191919;
}

.login-view__error {
  font-size: 13px;
  color: #e03131;
}

.login-view__terms {
  font-size: 12px;
  color: var(--muted, #8a8a8f);
}
</style>
