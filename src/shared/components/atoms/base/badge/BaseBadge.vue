<script setup>
defineProps({
  // point: 주의/변동 강조, mint: 긍정/레벨 강조, neutral: 기본, outline: 테두리만, quest: 신규 목표 안내 강조(골드)
  variant: { type: String, default: 'neutral' },
})
</script>

<template>
  <span class="base-badge" :class="`base-badge--${variant}`">
    <slot />
  </span>
</template>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 0 8px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
}

.base-badge--point {
  background: rgba(193, 68, 46, 0.15);
  color: var(--color-point, #c1442e);
}

.base-badge--mint {
  background: var(--color-mint-strong, #c1e8c8);
  color: var(--color-mint-deep, #16281c);
}

.base-badge--neutral {
  background: #1e211f;
  color: var(--text, #9aa09a);
}

.base-badge--outline {
  background: transparent;
  border-color: var(--border, #262626);
  color: var(--text, #9aa09a);
}

.base-badge--quest {
  background: transparent;
  border-color: #d4a857;
  color: #d4a857;
}
</style>
