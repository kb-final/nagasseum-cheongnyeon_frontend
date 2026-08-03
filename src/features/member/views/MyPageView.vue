<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/shared/components/molecules/AppHeader.vue'
import BaseToggle from '@/shared/components/atoms/form/Toggle/BaseToggle.vue'
import BaseModal from '@/shared/components/atoms/feedback/Modal/BaseModal.vue'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'

import { useAuthStore } from '@/features/auth'
import { useMemberStore, AGREEMENT_TYPE } from '@/features/member/store/memberStore'

const router = useRouter()
const authStore = useAuthStore()
const memberStore = useMemberStore()

const isLogoutModalOpen = ref(false)

const notificationAgreed = computed({
  get: () => memberStore.profile?.notificationAgreed ?? false,
  set: (value) => memberStore.toggleAgreement(AGREEMENT_TYPE.NOTIFICATION, value),
})

const compareDataAgreed = computed({
  get: () => memberStore.profile?.compareDataAgreed ?? false,
  set: (value) => memberStore.toggleAgreement(AGREEMENT_TYPE.COMPARE_DATA, value),
})

onMounted(() => {
  if (!memberStore.profile) memberStore.fetchProfile()
})

function goToEditInfo() {
  router.push({ name: 'edit-info' })
}

function goToAssetLink() {
  router.push({ name: 'asset-link-additional' })
}

function openLogoutModal() {
  isLogoutModalOpen.value = true
}

async function confirmLogout() {
  isLogoutModalOpen.value = false
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="my-page-view">
    <AppHeader title="마이페이지" :show-back="false" />

    <section class="my-page-view__profile">
      <div class="my-page-view__avatar">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path
            d="M4 21C4 16.5817 7.58172 13 12 13C16.4183 13 20 16.5817 20 21"
            fill="currentColor"
          />
        </svg>
      </div>
      <p class="my-page-view__nickname">{{ memberStore.profile?.nickname ?? '회원' }} 님</p>
      <span class="my-page-view__badge">등반가 · 고도 27%</span>
    </section>

    <section class="my-page-view__section">
      <h2 class="my-page-view__section-title">계정 관리</h2>
      <button type="button" class="my-page-view__row" @click="goToEditInfo">
        <span class="my-page-view__row-label">회원정보 수정</span>
        <svg class="my-page-view__chevron" viewBox="0 0 12 12" width="12" height="12">
          <path
            d="M4 1L10 6L4 11"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <button type="button" class="my-page-view__row" @click="openLogoutModal">
        <span class="my-page-view__row-label">로그아웃</span>
        <svg class="my-page-view__chevron" viewBox="0 0 12 12" width="12" height="12">
          <path
            d="M4 1L10 6L4 11"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <button type="button" class="my-page-view__row" @click="goToAssetLink">
        <span class="my-page-view__row-label">자산 연동 관리</span>
        <svg class="my-page-view__chevron" viewBox="0 0 12 12" width="12" height="12">
          <path
            d="M4 1L10 6L4 11"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </section>

    <section class="my-page-view__section">
      <h2 class="my-page-view__section-title">알림 설정</h2>
      <div class="my-page-view__row my-page-view__row--toggle">
        <div class="my-page-view__row-text">
          <span class="my-page-view__row-label">알림 받기</span>
          <span class="my-page-view__row-desc">저축 현황, 정책 마감 등 주요 소식을 알려드려요</span>
        </div>
        <BaseToggle v-model="notificationAgreed" />
      </div>
      <div class="my-page-view__row my-page-view__row--toggle">
        <div class="my-page-view__row-text">
          <span class="my-page-view__row-label">[선택] 또래 비교 데이터 제공</span>
          <span class="my-page-view__row-desc">또래 등반 통계에 익명으로 활용돼요</span>
        </div>
        <BaseToggle v-model="compareDataAgreed" />
      </div>
    </section>

    <section class="my-page-view__section">
      <h2 class="my-page-view__section-title">앱 정보</h2>
      <a href="#" class="my-page-view__row">
        <span class="my-page-view__row-label">이용약관</span>
        <svg class="my-page-view__chevron" viewBox="0 0 12 12" width="12" height="12">
          <path
            d="M4 1L10 6L4 11"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>
      <a href="#" class="my-page-view__row">
        <span class="my-page-view__row-label">개인정보 처리방침</span>
        <svg class="my-page-view__chevron" viewBox="0 0 12 12" width="12" height="12">
          <path
            d="M4 1L10 6L4 11"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>
      <div class="my-page-view__row my-page-view__row--static">
        <span class="my-page-view__row-label">앱 버전</span>
        <span class="my-page-view__row-value">1.0.0</span>
      </div>
    </section>

    <BaseModal v-model="isLogoutModalOpen" title="로그아웃 하시겠어요?">
      <p class="my-page-view__logout-desc">로그아웃하면 다시 로그인해야 앱을 이용할 수 있어요</p>
      <template #footer>
        <BaseButton variant="secondary" size="modal" @click="isLogoutModalOpen = false">
          취소
        </BaseButton>
        <BaseButton variant="primary" size="modal" @click="confirmLogout">로그아웃</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.my-page-view {
  display: flex;
  flex-direction: column;
}

.my-page-view__profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0 24px;
}

.my-page-view__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 76px;
  border-radius: 38px;
  background: var(--accent, #e3ffe8);
  color: var(--color-mint-deep, #16281c);
}

.my-page-view__nickname {
  margin: 12px 0 0;
  font-size: 17px;
  color: var(--text-h, #ffffff);
}

.my-page-view__badge {
  margin-top: 12px;
  padding: 5px 14px;
  border-radius: 999px;
  background: var(--accent, #e3ffe8);
  color: var(--color-mint-deep, #16281c);
  font-size: 11.6px;
}

.my-page-view__section {
  padding-top: 12px;
}

.my-page-view__section-title {
  margin: 0 0 4px;
  padding: 0 4px;
  font-size: 12.3px;
  font-weight: 400;
  color: var(--color-mint-strong, #c1e8c8);
}

.my-page-view__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 4px;
  border: none;
  border-top: 1px solid var(--border, #262626);
  background: none;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

.my-page-view__row--static {
  cursor: default;
}

.my-page-view__row-label {
  font-size: 13.9px;
  color: var(--text-h, #ffffff);
}

.my-page-view__row-value {
  font-size: 13.2px;
  color: var(--text, #9aa09a);
}

.my-page-view__chevron {
  color: var(--text, #9aa09a);
}

.my-page-view__row--toggle {
  align-items: center;
}

.my-page-view__row-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.my-page-view__row-desc {
  font-size: 11.1px;
  color: var(--text, #9aa09a);
}

.my-page-view__logout-desc {
  margin: 0;
  color: #4a5a52;
  font-size: 13px;
  text-align: center;
}
</style>
