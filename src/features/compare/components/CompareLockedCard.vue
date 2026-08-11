<script setup>
import { useRouter } from 'vue-router'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import lockedImage from '@/features/compare/assets/locked.png'

const router = useRouter()

function goToAgreement() {
  router.push({ name: 'my' })
}
</script>

<template>
  <section class="locked">
    <div class="locked__art">
      <span class="locked__line"></span>
      <span class="locked__line"></span>
      <span class="locked__line"></span>
      <span class="locked__lock"><img :src="lockedImage" alt="" /></span>
    </div>

    <span class="locked__badge">LOCKED</span>
    <h2 class="locked__title">아직 비교할 수 없어요</h2>

    <p class="locked__body">
      다른 사용자의 목표를 조회하고 싶으시다면 마이페이지에서<br />
      <b>"또래 비교 데이터 제공"</b> 약관에 동의해주세요.
    </p>

    <div class="locked__info">
      <p class="locked__info-title"><span class="locked__dot"></span>왜 동의가 필요한가요?</p>
      <ul class="locked__info-list">
        <li>내 익명화된 목표 데이터를 함께 제공하고</li>
        <li>비슷한 자산의 사용자 데이터를 볼 수 있어요</li>
      </ul>
    </div>

    <BaseButton class="locked__cta" variant="primary" size="lg" @click="goToAgreement">
      약관 동의하러 가기
    </BaseButton>
  </section>
</template>

<style scoped>
.locked {
  --badge: var(--c-value);
  --on-pale: var(--c-on-accent);
  --on-pale-strong: var(--c-on-accent);

  --art-face: var(--c-accent-soft);
  --art-line: var(--c-accent-mid);
  --art-lock: var(--c-accent);
  --art-gap: var(--c-bg);

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0 0;
  text-align: center;
  line-height: 1.45;
}

.locked__art {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--art-face);
}

.locked__line {
  position: absolute;
  left: 30px;
  height: 10px;
  background: var(--art-line);
}

.locked__line:nth-of-type(1) {
  top: 40px;
  width: 60px;
}

.locked__line:nth-of-type(2) {
  top: 58px;
  width: 46px;
}

.locked__line:nth-of-type(3) {
  top: 76px;
  width: 54px;
}

.locked__lock {
  position: absolute;
  top: 84px;
  left: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 4px solid var(--art-gap);
  background: var(--art-lock);
  box-sizing: border-box;
}

.locked__lock img {
  width: 17px;
  height: 17px;
  image-rendering: pixelated;
}

.locked__badge {
  margin-top: 16px;
  border: 1px solid var(--badge);
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--badge);
}

.locked__title {
  margin: 10px 0 0;
  font-size: 17px;
  color: var(--c-ink);
}

.locked__body {
  margin: 20px 0 0;
  font-size: 12px;
  line-height: 1.7;
  color: var(--c-ink-muted);
}

.locked__body b {
  font-weight: inherit;
  color: var(--c-ink);
}

.locked__info {
  width: 100%;
  margin-top: 32px;
  border-radius: 12px;
  padding: 14px 16px;
  background: var(--c-accent);
  text-align: left;
  color: var(--on-pale);
}

.locked__info-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--on-pale-strong);
}

.locked__dot {
  flex: none;
  width: 8px;
  height: 8px;
  background: currentColor;
}

.locked__info-list {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 11px;
}

.locked__info-list li {
  display: flex;
  gap: 6px;
}

.locked__info-list li + li {
  margin-top: 4px;
}

.locked__info-list li::before {
  content: '·';
}

.locked__cta {
  margin-top: 20px;
}
</style>
