<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/shared/components/molecules/AppHeader.vue'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import BaseFieldBadge from '@/shared/components/atoms/base/badge/BaseFieldBadge.vue'
import BaseInputField from '@/shared/components/molecules/BaseInputField.vue'
import BaseOptionCardGroup from '@/shared/components/atoms/form/OptionCardGroup/BaseOptionCardGroup.vue'

import { useToast } from '@/shared/composables/useToast'
import { useMemberStore } from '@/features/member/store/memberStore'

const incomeBracketOptions = [
  { value: 'INCOME_DECILE_1', label: '1분위', sublabel: '하위 10%' },
  { value: 'INCOME_DECILE_2_3', label: '2~3분위', sublabel: '하위 10~30%' },
  { value: 'INCOME_DECILE_4_5', label: '4~5분위', sublabel: '중위 30~50%' },
  { value: 'INCOME_DECILE_6_7', label: '6~7분위', sublabel: '중위 50~70%' },
  { value: 'INCOME_DECILE_8_9', label: '8~9분위', sublabel: '상위 30%' },
  { value: 'INCOME_DECILE_10', label: '10분위', sublabel: '상위 10%' },
]

const router = useRouter()
const memberStore = useMemberStore()
const { show: showToast } = useToast()

const nickname = ref('')
const incomeBracket = ref(null)

onMounted(async () => {
  if (!memberStore.profile) await memberStore.fetchProfile()
  nickname.value = memberStore.profile?.nickname ?? ''
  incomeBracket.value = memberStore.profile?.incomeBracket ?? null
})

async function handleSave() {
  await memberStore.updateProfile({
    nickname: nickname.value,
    incomeBracket: incomeBracket.value,
  })
  if (memberStore.error) return

  showToast('회원정보가 수정되었습니다', { type: 'success' })
  router.back()
}
</script>

<template>
  <div class="edit-info-view">
    <AppHeader title="회원정보 수정" @back="router.back()" />

    <section class="edit-info-view__avatar-section">
      <div class="edit-info-view__avatar">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path
            d="M4 21C4 16.5817 7.58172 13 12 13C16.4183 13 20 16.5817 20 21"
            fill="currentColor"
          />
        </svg>
        <span class="edit-info-view__avatar-edit">
          <svg viewBox="0 0 16 16" width="9" height="9">
            <path
              d="M11 1L15 5L5 15H1V11L11 1Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
      <p class="edit-info-view__avatar-label">프로필 사진 변경</p>
    </section>

    <section class="edit-info-view__section">
      <h2 class="edit-info-view__section-title">기본 정보</h2>

      <BaseInputField
        v-model="nickname"
        label="닉네임"
        required
        :max-length="12"
        placeholder="2~12자 한글 · 영문 · 숫자"
        helper-text="서비스에서 표시되는 이름입니다"
      />

      <div class="edit-info-view__field">
        <div class="edit-info-view__field-label-row">
          <span class="edit-info-view__field-label">소득 분위</span>
          <BaseFieldBadge :required="false" />
        </div>
        <BaseOptionCardGroup v-model="incomeBracket" :options="incomeBracketOptions" />
      </div>
    </section>

    <div class="edit-info-view__footer">
      <BaseButton size="lg" @click="handleSave">저장하기</BaseButton>
    </div>
  </div>
</template>

<style scoped>
.edit-info-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 24px;
}

.edit-info-view__avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.edit-info-view__avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 84px;
  height: 84px;
  border-radius: 42px;
  background: var(--accent, #e3ffe8);
  color: var(--color-mint-deep, #16281c);
}

.edit-info-view__avatar-edit {
  position: absolute;
  right: -2px;
  bottom: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background: var(--bg, #111111);
  border: 1px solid var(--border, #262626);
  color: var(--text-h, #ffffff);
}

.edit-info-view__avatar-label {
  margin: 0;
  font-size: 12px;
  color: var(--text, #9aa09a);
}

.edit-info-view__section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.edit-info-view__section-title {
  margin: 0;
  font-size: 13.2px;
  font-weight: 500;
  color: var(--text-h, #ffffff);
}

.edit-info-view__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-info-view__field-label-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-info-view__field-label {
  color: var(--text-h, #ffffff);
  font-weight: 500;
}

.edit-info-view__footer {
  display: flex;
  justify-content: center;
}
</style>
