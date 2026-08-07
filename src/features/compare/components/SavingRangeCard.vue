<script setup>
import { computed } from 'vue'

import runnerImage from '@/features/compare/assets/runner.png'

const TRACK_MAX = 1_500_000

const props = defineProps({
  myMonthlySaving: { type: Number, required: true },
  cohortRangeMin: { type: Number, required: true },
  cohortRangeMax: { type: Number, required: true },
})

const manwon = (won) => Math.round(won / 10000).toLocaleString()

const toPercent = (won) => Math.min(100, Math.max(0, (won / TRACK_MAX) * 100))

const rangeStartPct = computed(() => toPercent(props.cohortRangeMin))
const rangeEndPct = computed(() => toPercent(props.cohortRangeMax))
const myPct = computed(() => toPercent(props.myMonthlySaving))
</script>

<template>
  <div class="card">
    <p class="card__title">
      월 저축액 구간
      <span class="card__range">{{ manwon(cohortRangeMin) }}~{{ manwon(cohortRangeMax) }}만원</span>
    </p>

    <div class="gauge">
      <span class="gauge__my-label" :style="{ left: `${myPct}%` }">
        나 {{ manwon(myMonthlySaving) }}만
      </span>

      <div class="gauge__track">
        <span
          class="gauge__band"
          :style="{ left: `${rangeStartPct}%`, width: `${rangeEndPct - rangeStartPct}%` }"
        ></span>
      </div>

      <img class="gauge__runner" :src="runnerImage" alt="" :style="{ left: `${myPct}%` }" />

      <span class="gauge__tick" :style="{ left: `${rangeStartPct}%` }">
        {{ manwon(cohortRangeMin) }}만
      </span>
      <span class="gauge__tick" :style="{ left: `${rangeEndPct}%` }">
        {{ manwon(cohortRangeMax) }}만
      </span>
    </div>

    <div class="gauge__ends">
      <span>0</span>
      <span>{{ manwon(TRACK_MAX) }}만+</span>
    </div>
  </div>
</template>

<style scoped>
.card {
  --cream: #f6f8d9;
  --ink: #10130f;
  --ink-muted: #4e5c50;
  --track: #d9dcc0;
  --band: #9fd8ab;

  border-radius: 20px;
  padding: 16px;
  background: var(--cream);
  color: var(--ink);
  line-height: 1.45;
}

.card__title {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  font-size: 14px;
}

.card__range {
  font-size: 13px;
  color: var(--ink-muted);
}

.gauge {
  position: relative;
  margin: 44px 0 22px;
}

.gauge__track {
  position: relative;
  height: 6px;
  background: var(--track);
}

.gauge__band {
  position: absolute;
  top: 0;
  height: 100%;
  background: var(--band);
}

.gauge__runner {
  position: absolute;
  bottom: 6px;
  width: 30px;
  height: 30px;
  transform: translateX(-50%);
  image-rendering: pixelated;
}

.gauge__my-label {
  position: absolute;
  bottom: 40px;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 12px;
  color: var(--ink);
}

.gauge__tick {
  position: absolute;
  top: 14px;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 12px;
  color: var(--ink-muted);
}

.gauge__ends {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--ink-muted);
}
</style>
