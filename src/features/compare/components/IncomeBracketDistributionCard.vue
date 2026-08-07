<script setup>
import { computed } from 'vue'

import { formatWon } from '@/shared/utils/formatter'

import SegmentBarList from '@/features/compare/components/SegmentBarList.vue'

const props = defineProps({
  brackets: { type: Array, required: true },
  myMonthlyIncome: { type: Number, default: null },
})

const barItems = computed(() =>
  props.brackets.map((item) => ({
    key: item.bracket,
    label: item.bracket,
    ratio: item.ratio,
    badge: item.isMine ? '내 구간' : null,
    highlighted: item.isMine,
  })),
)
</script>

<template>
  <div class="card">
    <p class="card__title">소득 구간 분포</p>
    <p v-if="myMonthlyIncome != null" class="card__desc">
      내 월 소득은 <b>{{ formatWon(myMonthlyIncome) }}</b
      >이에요
    </p>
    <SegmentBarList :items="barItems" />
  </div>
</template>

<style scoped>
.card {
  --cream: #f6f8d9;
  --ink: #10130f;
  --forest: #1d6b3f;
  --forest-soft: #7fae89;
  --segment: #d9dcc0;
  --segment-on: var(--forest-soft);
  --segment-on-highlight: var(--forest);
  --badge: #ffd939;

  border-radius: 20px;
  padding: 16px;
  background: var(--cream);
  color: var(--ink);
  line-height: 1.45;
}

.card__title {
  margin: 0;
  font-size: 14px;
}

.card__desc {
  margin: 8px 0 0;
  font-size: 13px;
}

.card__desc b {
  font-weight: inherit;
  color: var(--forest);
}
</style>
