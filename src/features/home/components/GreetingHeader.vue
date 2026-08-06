<script setup>
import BaseBadge from '@/shared/components/atoms/base/badge/BaseBadge.vue'

defineProps({
  member: { type: Object, required: true },
})
</script>

<template>
  <div class="greeting-header">
    <div class="greeting-header__text">
      <span class="greeting-header__hello">안녕하세요, {{ member.nickname }} 님</span>
      <BaseBadge variant="mint">Lv.{{ member.level }} {{ member.levelTitle }}</BaseBadge>
    </div>
    <button type="button" class="greeting-header__bell" aria-label="알림">
      <span v-if="member.hasUnreadNotification" class="greeting-header__bell-dot" />
      <img src="@/assets/images/bell.png" alt="알림" class="greeting-header__bell-icon" />
    </button>
  </div>
</template>

<style scoped>
.greeting-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.greeting-header__text {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.greeting-header__hello {
  overflow: hidden;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-h, #ffffff);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.greeting-header__bell {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text, #9aa09a);
  cursor: pointer;
}

.greeting-header__bell-icon {
  width: 20px;
  height: 20px;
  image-rendering: pixelated;
}

.greeting-header__bell-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-point, #c1442e);
}
</style>
