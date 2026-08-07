<script setup>
import { formatManwon } from '@/shared/utils/formatter'

defineProps({
  cohortAverageNetAssets: { type: Number, required: true },
})
</script>

<template>
  <div class="card">
    <p class="card__title">또래는 이만큼 모았어요</p>
    <p class="card__value">{{ formatManwon(cohortAverageNetAssets) }}</p>
    <p class="card__desc">비슷한 자산·나이대 또래의 평균 순자산이에요</p>
  </div>
</template>

<style scoped>
.card {
  --cream: #f6f8d9;
  --ink: #10130f;
  --ink-muted: #4e5c50;
  --forest: #1d6b3f;

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

.card__value {
  margin: 8px 0 0;
  font-size: 26px;
  font-weight: 700;
  color: var(--forest);
  font-variant-numeric: tabular-nums;
}

.card__desc {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--ink-muted);
}
</style>
