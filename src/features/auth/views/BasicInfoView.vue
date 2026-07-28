<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import BaseFieldBadge from '@/shared/components/atoms/base/badge/BaseFieldBadge.vue'
import BaseOptionCardGroup from '@/shared/components/atoms/form/OptionCardGroup/BaseOptionCardGroup.vue'
import BaseToggle from '@/shared/components/atoms/form/Toggle/BaseToggle.vue'
import BaseBreadcrumb from '@/shared/components/atoms/navigation/Breadcrumb/BaseBreadcrumb.vue'
import BaseInputField from '@/shared/components/molecules/BaseInputField.vue'
import AppHeader from '@/shared/components/molecules/AppHeader.vue'
import { ONBOARDING_STEPS } from '@/shared/constants/onboardingSteps'

import { useAuthStore } from '@/features/auth/store/authStore'

const NICKNAME_MAX_LENGTH = 12

const incomeBracketOptions = [
  { value: 1, label: '1분위', sublabel: '하위 10%' },
  { value: 2, label: '2~3분위', sublabel: '하위 10~30%' },
  { value: 3, label: '4~5분위', sublabel: '중위 30~50%' },
  { value: 4, label: '6~7분위', sublabel: '중위 50~70%' },
  { value: 5, label: '8~9분위', sublabel: '상위 30%' },
  { value: 6, label: '10분위', sublabel: '상위 10%' },
]

const router = useRouter()
const authStore = useAuthStore()

const nickname = ref(authStore.user?.nickname ?? '')
const incomeBracket = ref(authStore.user?.incomeBracket ?? null)
const notifications = reactive({
  altitudeAlert: authStore.user?.notifications?.altitudeAlert ?? true,
  policyDeadlineAlert: authStore.user?.notifications?.policyDeadlineAlert ?? true,
  peerComparison: authStore.user?.notifications?.peerComparison ?? false,
})

const isSubmitting = ref(false)
const errorMessage = ref('')

const canSubmit = computed(() => nickname.value.trim().length > 0 && !isSubmitting.value)

async function handleNext() {
  if (!canSubmit.value) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await authStore.submitBasicInfo({
      nickname: nickname.value,
      incomeBracket: incomeBracket.value,
      notifications: { ...notifications },
    })
    router.push({ name: 'asset-link' })
  } catch {
    errorMessage.value = '저장에 실패했습니다. 잠시 후 다시 시도해주세요.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="basic-info-view">
    <AppHeader title="등반 준비" :show-back="false" />
    <BaseBreadcrumb class="basic-info-view__steps" :steps="ONBOARDING_STEPS" :current="2" />

    <div class="basic-info-view__body">
      <div class="basic-info-view__intro">
        <h2 class="basic-info-view__title">
          반갑습니다!<br />
          기본 정보를 알려주세요
        </h2>
        <p class="basic-info-view__subtitle">맞춤 등반 경로와 청년 정책 추천에 활용됩니다</p>
      </div>

      <BaseInputField
        v-model="nickname"
        label="닉네임"
        required
        placeholder="2~12자 한글 · 영문 · 숫자"
        :max-length="NICKNAME_MAX_LENGTH"
        helper-text="서비스에서 표시되는 이름입니다"
      />

      <section class="basic-info-view__section">
        <div class="basic-info-view__section-label-row">
          <span class="basic-info-view__section-label">소득 분위</span>
          <BaseFieldBadge :required="false" />
        </div>
        <p class="basic-info-view__section-helper">
          맞춤 청년 정책 추천에 활용되며, 언제든지 수정 가능합니다
        </p>
        <BaseOptionCardGroup v-model="incomeBracket" :options="incomeBracketOptions" />
      </section>

      <section class="basic-info-view__section">
        <h3 class="basic-info-view__section-title">알림 설정</h3>

        <div class="basic-info-view__toggle-row">
          <div class="basic-info-view__toggle-text">
            <p class="basic-info-view__toggle-title">고도 상승 알림</p>
            <p class="basic-info-view__toggle-desc">저축 현황이 변동될 때 알려드려요</p>
          </div>
          <BaseToggle v-model="notifications.altitudeAlert" />
        </div>

        <div class="basic-info-view__toggle-row">
          <div class="basic-info-view__toggle-text">
            <p class="basic-info-view__toggle-title">정책 마감 알림</p>
            <p class="basic-info-view__toggle-desc">신청 가능한 정책 마감 전 안내드려요</p>
          </div>
          <BaseToggle v-model="notifications.policyDeadlineAlert" />
        </div>

        <div class="basic-info-view__toggle-row">
          <div class="basic-info-view__toggle-text">
            <p class="basic-info-view__toggle-title">[선택] 또래 비교 데이터 제공</p>
            <p class="basic-info-view__toggle-desc">또래 등반 통계에 익명으로 활용돼요</p>
          </div>
          <BaseToggle v-model="notifications.peerComparison" />
        </div>
      </section>
    </div>

    <div class="basic-info-view__footer">
      <p v-if="errorMessage" class="basic-info-view__error">{{ errorMessage }}</p>
      <BaseButton size="lg" :disabled="!canSubmit" @click="handleNext">
        {{ isSubmitting ? '저장 중...' : '다음 · 자산 연동하기' }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.basic-info-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 390px;
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
  color: var(--text-h, #ffffff);
}

.basic-info-view__subtitle {
  margin: 0;
  font-size: 13.1px;
  color: var(--text, #9aa09a);
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
  color: var(--text-h, #ffffff);
}

.basic-info-view__section-helper {
  margin: -8px 0 0;
  font-size: 11.1px;
  color: var(--text, #6e756f);
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
  color: var(--text-h, #ffffff);
}

.basic-info-view__toggle-desc {
  margin: 4px 0 0;
  font-size: 11.1px;
  color: var(--text, #6e756f);
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
