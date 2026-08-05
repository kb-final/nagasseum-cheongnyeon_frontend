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

/** 금액을 눈금 위 위치(%)로. 눈금 밖으로 나가지 않게 자른다. */
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
      <!-- 캐릭터와 라벨은 absolute라 높이를 차지하지 않는다. 위쪽 여백이 그 자리다. -->
      <span class="gauge__my-label" :style="{ left: `${myPct}%` }">
        나 {{ manwon(myMonthlySaving) }}만
      </span>

      <div class="gauge__track">
        <!-- 또래의 가운데 50% 구간. 내 위치와 무관하게 이 구간만 칠한다. -->
        <span
          class="gauge__band"
          :style="{ left: `${rangeStartPct}%`, width: `${rangeEndPct - rangeStartPct}%` }"
        ></span>
      </div>

      <img class="gauge__runner" :src="runnerImage" alt="" :style="{ left: `${myPct}%` }" />

      <!-- 구간 양 끝 눈금. 막대 아래에 구간 경계와 같은 위치로 붙인다. -->
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
/* 폰트 크기는 rem이 아닌 px로 고정한다.
   루트가 18px/16px로 바뀌면 픽셀 폰트가 그리드에서 어긋나 뭉개진다. */
.card {
  /* 이 카드에서만 쓰는 색 */
  --cream: #f6f8d9;
  --ink: #10130f;
  --ink-muted: #4e5c50;
  --track: #d9dcc0;
  --band: #9fd8ab;

  border-radius: 20px;
  padding: 16px;
  background: var(--cream);
  color: var(--ink);
  /* 루트의 145%는 18px 기준으로 계산된 26.1px이 그대로 상속된다.
     단위 없는 값으로 덮어써야 각 요소가 제 폰트 크기로 줄 높이를 계산한다. */
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

/* 위 여백은 캐릭터와 '나' 라벨 자리, 아래 여백은 구간 눈금 자리다.
   둘 다 absolute라 높이를 차지하지 않아 여기서 미리 확보해둔다. */
.gauge {
  position: relative;
  margin: 44px 0 22px;
}

/* 모서리를 굴리지 않는다. 앱 전체가 각진 픽셀 톤이라 여기만 둥글면 튄다. */
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
