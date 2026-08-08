<script setup>
import { computed } from 'vue'

import SegmentBarList from '@/features/compare/components/SegmentBarList.vue'

const props = defineProps({
  myRate: { type: Number, required: true },
  cohortAverageRate: { type: Number, required: true },
})

const barItems = computed(() => [
  { key: 'mine', label: '내 달성률', ratio: props.myRate, highlighted: true },
  { key: 'avg', label: '또래 평균', ratio: props.cohortAverageRate, highlighted: false },
])

const gapToAverage = computed(
  () => Math.round((props.cohortAverageRate - props.myRate) * 100) / 100,
)

const summary = computed(() => {
  if (gapToAverage.value > 0) return `또래 평균까지 ${gapToAverage.value}%p 남았어요`
  if (gapToAverage.value < 0) return `또래 평균보다 ${Math.abs(gapToAverage.value)}%p 앞서 있어요`
  return '또래 평균과 같아요'
})
</script>

<template>
  <div class="card">
    <p class="card__title">달성률 분포</p>
    <SegmentBarList :items="barItems" />
    <p class="card__summary">{{ summary }}</p>
  </div>
</template>

<style scoped>
.card {
  --ink: #e8f0e6;
  --ink-muted: #7fa398;
  --segment: #263029;
  --segment-on: #c9a26b;
  --segment-on-highlight: #9fd8ab;
  --badge: #ffd939;

  border: 1px solid #334234;
  border-radius: 0;
  padding: 16px;
  background: #171b16;
  color: var(--ink);
  line-height: 1.45;
  animation: card-rise 0.35s ease-out both;
  animation-delay: 0.06s;
}

.card__title {
  margin: 0;
  font-size: 14px;
}

.card__summary {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--ink-muted);
}
</style>
