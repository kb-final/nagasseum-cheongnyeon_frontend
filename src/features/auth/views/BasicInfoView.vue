<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import BaseFieldBadge from '@/shared/components/atoms/base/badge/BaseFieldBadge.vue'
import BaseOptionCardGroup from '@/shared/components/atoms/form/OptionCardGroup/BaseOptionCardGroup.vue'
import BaseToggle from '@/shared/components/atoms/form/Toggle/BaseToggle.vue'
import BaseBreadcrumb from '@/shared/components/atoms/navigation/Breadcrumb/BaseBreadcrumb.vue'
import AppHeader from '@/shared/components/molecules/AppHeader.vue'
import { ONBOARDING_STEPS } from '@/shared/constants/onboardingSteps'
import { INCOME_BRACKET_OPTIONS } from '@/shared/constants/incomeBracket'

import { useAuthStore } from '@/features/auth/store/authStore'

const router = useRouter()
const authStore = useAuthStore()

const kakaoId = authStore.pendingSignup?.kakaoId ?? null
const nickname = authStore.pendingSignup?.nickname ?? ''
const birthDate = authStore.pendingSignup?.birthDate ?? ''

const incomeBracket = ref(null)
const notificationAgreed = ref(true)
const compareDataAgreed = ref(false)

const isSubmitting = ref(false)
const errorMessage = ref(kakaoId ? '' : '잘못된 접근입니다. 카카오 로그인을 다시 시도해주세요.')

const canSubmit = computed(() => !isSubmitting.value)

function goToLogin() {
  router.replace({ name: 'login' })
}

async function handleNext() {
  if (!canSubmit.value) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await authStore.completeKakaoSignup({
      kakaoId,
      nickname,
      birthDate,
      incomeBracket: incomeBracket.value,
      agreements: [
        { agreementType: 'NOTIFICATION', agreed: notificationAgreed.value },
        { agreementType: 'COMPARE_DATA', agreed: compareDataAgreed.value },
      ],
    })
    router.push({ name: 'deposit-info' })
  } catch (error) {
    errorMessage.value =
      error.response?.data?.error?.message ?? '가입에 실패했습니다. 잠시 후 다시 시도해주세요.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="basic-info-view">
    <AppHeader title="등반 준비" :show-back="false" />
    <BaseBreadcrumb class="basic-info-view__steps" :steps="ONBOARDING_STEPS" :current="2" />

    <template v-if="kakaoId">
      <div class="basic-info-view__body">
        <div class="basic-info-view__intro">
          <h2 class="basic-info-view__title">
            {{ nickname }}님, 반갑습니다!<br />
            기본 정보를 알려주세요
          </h2>
          <p class="basic-info-view__subtitle">맞춤 등반 경로와 청년 정책 추천에 활용됩니다</p>
        </div>

        <section class="basic-info-view__section">
          <div class="basic-info-view__section-label-row">
            <span class="basic-info-view__section-label">소득 분위</span>
            <BaseFieldBadge :required="false" />
          </div>
          <p class="basic-info-view__section-helper">
            맞춤 청년 정책 추천에 활용되며, 언제든지 수정 가능합니다
          </p>
          <BaseOptionCardGroup v-model="incomeBracket" :options="INCOME_BRACKET_OPTIONS" />
        </section>

        <section class="basic-info-view__section">
          <h3 class="basic-info-view__section-title">알림 설정</h3>

          <div class="basic-info-view__toggle-row">
            <div class="basic-info-view__toggle-text">
              <p class="basic-info-view__toggle-title">알림 받기</p>
              <p class="basic-info-view__toggle-desc">
                저축 현황, 정책 마감 등 주요 소식을 알려드려요
              </p>
            </div>
            <BaseToggle v-model="notificationAgreed" />
          </div>

          <div class="basic-info-view__toggle-row">
            <div class="basic-info-view__toggle-text">
              <p class="basic-info-view__toggle-title">[선택] 또래 비교 데이터 제공</p>
              <p class="basic-info-view__toggle-desc">또래 등반 통계에 익명으로 활용돼요</p>
            </div>
            <BaseToggle v-model="compareDataAgreed" />
          </div>
        </section>
      </div>

      <div class="basic-info-view__footer">
        <p v-if="errorMessage" class="basic-info-view__error">{{ errorMessage }}</p>
        <BaseButton size="lg" :disabled="!canSubmit" @click="handleNext">
          {{ isSubmitting ? '가입 중...' : '다음' }}
        </BaseButton>
      </div>
    </template>

    <div v-else class="basic-info-view__footer">
      <p class="basic-info-view__error">{{ errorMessage }}</p>
      <BaseButton size="lg" @click="goToLogin">로그인 화면으로 돌아가기</BaseButton>
    </div>
  </div>
</template>

<style scoped>
.basic-info-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 16px 24px 24px;
}

.basic-info-view__steps {
  align-self: center;
}

.basic-info-view__body {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.basic-info-view__intro {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.basic-info-view__title {
  margin: 0;
  font-size: 20.6px;
  font-weight: 500;
  line-height: 1.44;
  letter-spacing: -0.4px;
  color: var(--color-text-primary);
}

.basic-info-view__subtitle {
  margin: 0;
  font-size: 13.1px;
  color: var(--color-text-secondary);
}

.basic-info-view__section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.basic-info-view__section-label-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.basic-info-view__section-label,
.basic-info-view__section-title {
  font-size: 13.2px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.basic-info-view__section-helper {
  margin: -8px 0 0;
  font-size: 11.1px;
  color: var(--color-text-secondary);
}

.basic-info-view__toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.basic-info-view__toggle-title {
  margin: 0;
  font-size: 14.1px;
  color: var(--color-text-primary);
}

.basic-info-view__toggle-desc {
  margin: 4px 0 0;
  font-size: 11.1px;
  color: var(--color-text-secondary);
}

.basic-info-view__footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.basic-info-view__error {
  margin: 0;
  font-size: 13px;
  color: #e03131;
}
</style>
