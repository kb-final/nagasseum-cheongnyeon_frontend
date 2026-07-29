<script setup>
import { computed } from 'vue'

import runnerImage from '@/features/compare/assets/runner.png'

/** 눈금 최대값. 이보다 많이 저축해도 게이지는 끝에서 멈춘다(라벨 '150만+'의 의미). */
const TRACK_MAX = 1_500_000

const props = defineProps({
  myMonthlySaving: { type: Number, required: true },
  cohortRangeMin: { type: Number, required: true },
  cohortRangeMax: { type: Number, required: true },
})

/**
 * 700000 -> '70'. 숫자만 만든다.
 * 공용 formatManwon은 '70만원'처럼 단위까지 붙여서, '70~90만원'이나 '150만+' 형태를 만들 수 없다.
 * 반올림 방식은 공용 함수와 맞춰둔다.
 */
const manwon = (won) => Math.round(won / 10000).toLocaleString()

const fillPct = computed(() => Math.min(100, (props.myMonthlySaving / TRACK_MAX) * 100))
</script>

<template>
  <div class="card">
    <p class="card__title">월 저축액 구간</p>
    <p class="card__range">{{ manwon(cohortRangeMin) }}~{{ manwon(cohortRangeMax) }}만원</p>

    <div class="slider">
      <div class="slider__fill" :style="{ width: `${fillPct}%` }"></div>
      <img class="slider__runner" :src="runnerImage" alt="" :style="{ left: `${fillPct}%` }" />
    </div>

    <div class="slider__scale">
      <span>0</span>
      <span>{{ manwon(cohortRangeMin) }}만 · 나 {{ manwon(myMonthlySaving) }}만</span>
      <span>{{ manwon(TRACK_MAX) }}만+</span>
    </div>
  </div>
</template>

<style scoped>
/* 폰트 크기는 rem이 아닌 px로 고정한다.
   루트가 18px/16px로 바뀌면 픽셀 폰트가 그리드에서 어긋나 뭉개진다. */
.card {
  /* 이 카드에서만 쓰는 색 */
  --cream: #f6f8d9;
  --ink: #10130f;
  --ink-muted: #4e5c50;
  --track: #d9dcc0;
  --fill: #9fd8ab;

  border-radius: 20px;
  padding: 16px;
  background: var(--cream);
  color: var(--ink);
  /* 루트의 145%는 18px 기준으로 계산된 26.1px이 그대로 상속된다.
     단위 없는 값으로 덮어써야 각 요소가 제 폰트 크기로 줄 높이를 계산한다. */
  line-height: 1.45;
}

.card__title {
  margin: 0;
  font-size: 14px;
}

.card__range {
  margin: 6px 0 0;
  font-size: 14px;
  text-align: center;
}

/* 위쪽 여백은 캐릭터가 설 자리다. 캐릭터는 absolute라 높이를 차지하지 않는다. */
.slider {
  position: relative;
  height: 6px;
  margin-top: 35px;
  background: var(--track);
}

.slider__fill {
  height: 100%;
  background: var(--fill);
}

.slider__runner {
  position: absolute;
  bottom: 100%;
  width: 30px;
  height: 30px;
  transform: translateX(-50%);
  image-rendering: pixelated;
}

.slider__scale {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  margin-top: 4px;
  font-size: 12px;
  color: var(--ink-muted);
}

.slider__scale span:last-child {
  text-align: right;
}
</style>
