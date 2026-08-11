<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/shared/components/molecules/AppHeader.vue'
import BaseToggle from '@/shared/components/atoms/form/Toggle/BaseToggle.vue'
import BaseModal from '@/shared/components/atoms/feedback/Modal/BaseModal.vue'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import BaseProfileIcon from '@/shared/components/atoms/base/icon/BaseProfileIcon.vue'
import BaseChevronIcon from '@/shared/components/atoms/base/icon/BaseChevronIcon.vue'

import { useMemberStore, AGREEMENT_TYPE } from '@/features/member/store/memberStore'
import { useTheme } from '@/shared/composables/useTheme'

const router = useRouter()
const memberStore = useMemberStore()
const { theme, toggleTheme } = useTheme()

const isLogoutModalOpen = ref(false)

const isDarkTheme = computed({
  get: () => theme.value === 'dark',
  set: () => toggleTheme(),
})

const notificationAgreed = computed({
  get: () => memberStore.profile?.notificationAgreed ?? false,
  set: (value) => memberStore.toggleAgreement(AGREEMENT_TYPE.NOTIFICATION, value),
})

const compareDataAgreed = computed({
  get: () => memberStore.profile?.compareDataAgreed ?? false,
  set: (value) => memberStore.toggleAgreement(AGREEMENT_TYPE.COMPARE_DATA, value),
})

/**
 * 등반 레벨·고도.
 *
 * 서버가 아직 레벨을 내려주지 않는다. 산정 기준도 팀에서 정하지 않았다.
 * 기준이 정해지고 API에 필드가 생기면 아래 세 값을 memberStore.profile 에서
 * 읽어오도록 바꾸면 된다. 지금은 화면을 먼저 맞추기 위한 임시값이라 한곳에 모아둔다.
 */
const EXP_SEGMENT_COUNT = 10
const climbLevel = 3
const climbTitle = '등반가'
const altitudePercent = 27

/** 진행률을 칸 수로 바꾼다. 홈의 등반 카드와 같은 방식이다. */
const filledSegments = computed(() => Math.round((altitudePercent / 100) * EXP_SEGMENT_COUNT))

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

function confirmLogout() {
  isLogoutModalOpen.value = false
  router.push({ name: 'logout' })
}
</script>

<template>
  <div class="my-page-view">
    <AppHeader title="마이페이지" :show-back="false" />

    <section class="my-page-view__profile">
      <div class="my-page-view__avatar">
        <BaseProfileIcon />
      </div>
      <p class="my-page-view__nickname">{{ memberStore.profile?.nickname ?? '회원' }} 님</p>

      <div class="my-page-view__badges">
        <span class="my-page-view__badge my-page-view__badge--level">
          Lv.{{ climbLevel }} {{ climbTitle }}
        </span>
        <span class="my-page-view__badge">고도 {{ altitudePercent }}%</span>
      </div>

      <div class="my-page-view__exp">
        <span class="my-page-view__exp-label">EXP</span>
        <span class="my-page-view__exp-track">
          <span
            v-for="index in EXP_SEGMENT_COUNT"
            :key="index"
            class="my-page-view__exp-segment"
            :class="{
              'my-page-view__exp-segment--filled': index <= filledSegments,
              'my-page-view__exp-segment--current': index === filledSegments,
            }"
          />
        </span>
        <span class="my-page-view__exp-value">{{ altitudePercent }}%</span>
      </div>
    </section>

    <section class="my-page-view__section">
      <h2 class="my-page-view__section-title">계정 관리</h2>
      <button type="button" class="my-page-view__row" @click="goToEditInfo">
        <span class="my-page-view__row-label">회원정보 수정</span>
        <BaseChevronIcon class="my-page-view__chevron" />
      </button>
      <button type="button" class="my-page-view__row" @click="openLogoutModal">
        <span class="my-page-view__row-label">로그아웃</span>
        <BaseChevronIcon class="my-page-view__chevron" />
      </button>
      <button type="button" class="my-page-view__row" @click="goToAssetLink">
        <span class="my-page-view__row-label">자산 연동 관리</span>
        <BaseChevronIcon class="my-page-view__chevron" />
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
      <h2 class="my-page-view__section-title">테마 설정</h2>
      <div class="my-page-view__row my-page-view__row--toggle">
        <div class="my-page-view__row-text">
          <span class="my-page-view__row-label">다크 모드</span>
          <span class="my-page-view__row-desc">Light/Dark 테마를 전환해요</span>
        </div>
        <BaseToggle v-model="isDarkTheme" />
      </div>
    </section>

    <section class="my-page-view__section">
      <h2 class="my-page-view__section-title">앱 정보</h2>
      <router-link :to="{ name: 'terms' }" class="my-page-view__row">
        <span class="my-page-view__row-label">이용약관</span>
        <BaseChevronIcon class="my-page-view__chevron" />
      </router-link>
      <router-link :to="{ name: 'privacy' }" class="my-page-view__row">
        <span class="my-page-view__row-label">개인정보 처리방침</span>
        <BaseChevronIcon class="my-page-view__chevron" />
      </router-link>
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
  /* 레벨 뱃지와 EXP 현재 칸이 같이 쓰는 색. 이 화면에서만 쓴다. */
  --level-badge: #ffd939;

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
  color: var(--color-text-primary, #ffffff);
}

.my-page-view__badges {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}

.my-page-view__badge {
  padding: 3px 7px;
  border-radius: 999px;
  background: var(--accent, #e3ffe8);
  color: var(--color-mint-deep, #16281c);
  font-size: 11px;
  line-height: 1.5;
}

/* 레벨 뱃지만 노란색 */
.my-page-view__badge--level {
  background: var(--level-badge);
  color: #3a2f00;
}

.my-page-view__exp {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 280px;
  margin-top: 10px;
}

.my-page-view__exp-label {
  font-size: 9.5px;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary, #9aa09a);
}

/* 칸 사이를 띄워 눈금처럼 보이게 한다. 홈 등반 카드와 같은 방식이다. */
.my-page-view__exp-track {
  display: flex;
  flex: 1;
  gap: 4px;
}

.my-page-view__exp-segment {
  flex: 1;
  height: 11px;
  border-radius: 3px;
  background: var(--color-border, #262626);
}

.my-page-view__exp-segment--filled {
  background: var(--color-mint-strong, #c1e8c8);
}

/* 지금 서 있는 칸만 노란색. --filled 뒤에 와야 덮어쓴다. */
.my-page-view__exp-segment--current {
  background: var(--level-badge);
}

.my-page-view__exp-value {
  font-size: 10px;
  color: var(--color-text-secondary, #9aa09a);
  font-variant-numeric: tabular-nums;
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
  border-top: 1px solid var(--color-border, #262626);
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
  color: var(--color-text-primary, #ffffff);
}

.my-page-view__row-value {
  font-size: 13.2px;
  color: var(--color-text-secondary, #9aa09a);
}

.my-page-view__chevron {
  color: var(--color-text-secondary, #9aa09a);
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
  color: var(--color-text-secondary, #9aa09a);
}

.my-page-view__logout-desc {
  margin: 0;
  color: #4a5a52;
  font-size: 13px;
  text-align: center;
}
</style>
