<script setup>
import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'

defineProps({
  // [{ label, value }] — 예: [{ label: '목표 시점', value: '그대로 유지' }, ...]
  rows: { type: Array, required: true },
})
</script>

<template>
  <BaseCard class="recommendation-basis-card">
    <p class="recommendation-basis-card__label">이 계획의 기준</p>

    <div v-for="row in rows" :key="row.label" class="recommendation-basis-card__row">
      <span class="recommendation-basis-card__row-label">{{ row.label }}</span>
      <span class="recommendation-basis-card__row-value">{{ row.value }}</span>
    </div>
  </BaseCard>
</template>

<style scoped>
.recommendation-basis-card {
  display: flex;
  flex-direction: column;
}

.recommendation-basis-card__label {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-secondary, #9aa09a);
}

.recommendation-basis-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
}

.recommendation-basis-card__row:not(:last-child) {
  border-bottom: 1px solid var(--color-border, #262626);
}

.recommendation-basis-card__row-label {
  font-size: 14px;
  color: var(--color-text-secondary, #9aa09a);
}

.recommendation-basis-card__row-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
}
</style>
