<script setup>
import { computed } from 'vue'

import flagImage from '@/features/compare/assets/flag.png'

/** 가장 높은 막대의 칸 수. 나머지 막대는 이 값에 비례해 칸 수를 정한다. */
const MAX_SEGMENTS = 8

const props = defineProps({
  myRate: { type: Number, required: true },
  cohortAverageRate: { type: Number, required: true },
  buckets: { type: Array, required: true }, // [{ rangeMin, rangeMax, ratio, isMine }]
})

const maxRatio = computed(() => Math.max(...props.buckets.map((bucket) => bucket.ratio), 1))

function segmentCount(bucket) {
  return Math.max(1, Math.round((bucket.ratio / maxRatio.value) * MAX_SEGMENTS))
}

function bucketGrow(bucket) {
  return (bucket.rangeMax - bucket.rangeMin) / 10
}
</script>

<template>
  <div class="card">
    <p class="card__title">달성률 분포</p>
    <p class="card__desc">
      비슷한 자산의 사용자들은 <b>평균 {{ cohortAverageRate }}%</b> 달성 중입니다. <br />(나:
      <b>{{ myRate }}%</b>)
    </p>

    <div class="hist" :style="{ '--max-count': MAX_SEGMENTS }">
      <div
        v-for="bucket in buckets"
        :key="bucket.rangeMin"
        class="hist__col"
        :style="{ flexGrow: bucketGrow(bucket) }"
      >
        <div
          class="hist__bar"
          :class="{ 'hist__bar--mine': bucket.isMine }"
          :style="{ '--count': segmentCount(bucket) }"
        >
          <img v-if="bucket.isMine" class="hist__marker" :src="flagImage" alt="" />
        </div>
      </div>
    </div>

    <p class="hist__legend">
      <span class="hist__legend-dot"></span>나 ({{ myRate }}%) — 코호트 평균 ({{
        cohortAverageRate
      }}%)
    </p>
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
  --forest: #1d6b3f;
  --bar-body: #c2c7a8;
  --bar-line: #d9dcc0;
  --bar-body-mine: #165231;
  --bar-line-mine: #1d6b3f;

  border-radius: 20px;
  padding: 16px;
  background: var(--cream);
  color: var(--ink);
  /* 루트의 145%는 18px 기준으로 계산된 26.1px이 그대로 상속된다.
     단위 없는 값으로 덮어써야 각 요소가 제 폰트 크기로 줄 높이를 계산한다. */
  line-height: 1.45;
}

.card__title {
  margin: 0 0 8px;
  font-size: 14px;
}

.card__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
}

.card__desc b {
  font-weight: inherit;
  color: var(--forest);
}

.hist {
  --segment: 8px;
  --segment-gap: 2px;

  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: calc(var(--max-count) * (var(--segment) + var(--segment-gap)) - var(--segment-gap));
  margin-top: 48px;
}

.hist__col {
  display: flex;
  align-items: flex-end;
  flex-basis: 0;
  height: 100%;
}

/* 막대 높이를 칸 수의 배수로 딱 떨어지게 잡아, 잘리는 칸 없이 전부 같은 크기로 보이게 한다. */
.hist__bar {
  position: relative;
  width: 100%;
  height: calc(var(--count) * (var(--segment) + var(--segment-gap)) - var(--segment-gap));
  background: repeating-linear-gradient(
    to top,
    var(--bar-body) 0 var(--segment),
    var(--bar-line) var(--segment) calc(var(--segment) + var(--segment-gap))
  );
}

.hist__bar--mine {
  background: repeating-linear-gradient(
    to top,
    var(--bar-body-mine) 0 var(--segment),
    var(--bar-line-mine) var(--segment) calc(var(--segment) + var(--segment-gap))
  );
}

/* 원본이 8×8 도트라 8의 배수(16px)로 그려야 픽셀이 고르게 나온다. */
.hist__marker {
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  width: 16px;
  height: 16px;
  transform: translateX(-50%);
  image-rendering: pixelated;
}

.hist__legend {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--ink-muted);
}

.hist__legend-dot {
  flex: none;
  width: 8px;
  height: 8px;
  background: currentColor;
}
</style>
