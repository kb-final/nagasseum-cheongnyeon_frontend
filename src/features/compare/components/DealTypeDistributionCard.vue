<script setup>
import { computed } from 'vue'

import SegmentBarList from '@/features/compare/components/SegmentBarList.vue'

const props = defineProps({
  topDealType: { type: String, required: true },
  topDealRatio: { type: Number, required: true },
  items: { type: Array, required: true },
})

const barItems = computed(() =>
  props.items.map((item) => ({
    key: item.dealType,
    label: item.label,
    ratio: item.ratio,
    badge: item.rank === 1 ? '1위' : null,
    highlighted: item.rank === 1,
  })),
)
</script>

<template>
  <div class="card">
    <p class="card__title">목표 유형 분포</p>
    <p class="card__desc">
      나와 비슷한 자산 보유자들은 <br /><b>{{ topDealType }}({{ topDealRatio }}%)</b>를 가장 많이
      목표로 합니다
    </p>
    <SegmentBarList :items="barItems" />
  </div>
</template>

<style scoped>
.card {
  --ink: #e8f0e6;
  --ink-muted: #7fa398;
  --mint: #9fd8ab;
  --segment: #263029;
  --segment-on: #4f7a5c;
  --segment-on-highlight: var(--mint);
  --badge: #ffd939;

  border: 1px solid #334234;
  border-radius: 0;
  padding: 16px;
  background: #171b16;
  color: var(--ink);
  line-height: 1.45;
  animation: card-rise 0.35s ease-out both;
  animation-delay: 0.18s;
}

.card__title {
  margin: 0 0 8px;
  font-size: 14px;
}

.card__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--ink-muted);
}

.card__desc b {
  font-weight: inherit;
  color: var(--mint);
}
</style>
