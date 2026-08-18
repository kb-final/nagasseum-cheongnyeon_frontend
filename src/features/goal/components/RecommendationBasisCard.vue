<script setup>
import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'

defineProps({
  title: { type: String, required: true },
  // 있으면 rows/timeline 위에 안내 문장으로 보여준다 (예: PREFERENCE의 "이 계획은 이렇게 구성했어요")
  description: { type: String, default: null },
  // [{ label, value }] — 예: REALISTIC의 "목표 시점 / 목표 시점까지 준비 가능한 금액"
  rows: { type: Array, default: () => [] },
  // HOLD_OUT처럼 "기준 목표 시점 -> 예상 도달 시점"을 화살표로 이어 보여줘야 할 때만 채운다
  timeline: {
    type: Object,
    default: null,
    // { fromLabel, fromValue, toLabel, toValue }
  },
})
</script>

<template>
  <BaseCard class="recommendation-basis-card">
    <p class="recommendation-basis-card__label">{{ title }}</p>

    <div v-if="timeline" class="recommendation-basis-card__timeline">
      <div class="recommendation-basis-card__timeline-point">
        <span class="recommendation-basis-card__row-label">{{ timeline.fromLabel }}</span>
        <strong class="recommendation-basis-card__timeline-value">{{ timeline.fromValue }}</strong>
      </div>
      <span class="recommendation-basis-card__timeline-arrow">↓</span>
      <div class="recommendation-basis-card__timeline-point">
        <span class="recommendation-basis-card__row-label">{{ timeline.toLabel }}</span>
        <strong class="recommendation-basis-card__timeline-value">{{ timeline.toValue }}</strong>
      </div>
    </div>

    <div v-for="row in rows" :key="row.label" class="recommendation-basis-card__row">
      <span class="recommendation-basis-card__row-label">{{ row.label }}</span>
      <span class="recommendation-basis-card__row-value">{{ row.value }}</span>
    </div>

    <p v-if="description" class="recommendation-basis-card__description">{{ description }}</p>
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

.recommendation-basis-card__timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
  text-align: center;
}

.recommendation-basis-card__timeline-point {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recommendation-basis-card__timeline-value {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
}

.recommendation-basis-card__timeline-arrow {
  font-size: 14px;
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

.recommendation-basis-card__description {
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-secondary, #9aa09a);
}

.recommendation-basis-card__row + .recommendation-basis-card__description {
  margin-top: 12px;
}
</style>
