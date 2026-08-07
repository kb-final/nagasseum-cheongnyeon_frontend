<script setup>
import { computed } from 'vue'

import SegmentBarList from '@/features/compare/components/SegmentBarList.vue'

const props = defineProps({
  items: { type: Array, required: true },
})

const barItems = computed(() =>
  props.items.map((item) => ({
    key: item.occupationType,
    label: item.occupationType,
    ratio: item.ratio,
    badge: item.isMine ? '내 직업군' : null,
    highlighted: item.isMine,
  })),
)
</script>

<template>
  <div class="card">
    <p class="card__title">직업군 분포</p>
    <SegmentBarList :items="barItems" />
  </div>
</template>

<style scoped>
.card {
  --mint: #cdedd3;
  --ink: #10130f;
  --forest: #1d6b3f;
  --forest-soft: #7fae89;
  --segment: #a9c9b0;
  --segment-on: var(--forest-soft);
  --segment-on-highlight: var(--forest);
  --badge: #ffd939;

  border-radius: 20px;
  padding: 16px;
  background: var(--mint);
  color: var(--ink);
  line-height: 1.45;
}

.card__title {
  margin: 0;
  font-size: 14px;
}
</style>
