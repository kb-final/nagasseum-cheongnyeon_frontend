<script setup>
import { computed } from 'vue'

import flagImage from '@/features/compare/assets/flag.png'

/** 가장 높은 막대의 칸 수. 나머지 막대는 이 값에 비례해 칸 수를 정한다. */
const MAX_SEGMENTS = 8
/** .hist의 실제 CSS gap과 같아야 한다. 위치 계산이 이 값을 그대로 재사용한다. */
const COLUMN_GAP_PX = 6

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

/**
 * 막대 칸은 flex-grow 비율로 폭을 나눠 갖지만, 칸 사이 gap(6px)은 비율과 무관한 고정폭이다.
 * 그래서 "값 %"를 그대로 left로 꽂으면 뒤쪽 칸일수록 gap만큼씩 실제 칸 위치보다 왼쪽으로 밀린다
 * (예: 52%가 50~60 칸 안쪽 20% 지점이 아니라 칸 경계에 거의 붙어버린다).
 * 여기서 flex 계산을 그대로 재현해 칸 안에서의 정확한 위치를 구한다.
 */
function positionStyle(rate) {
  const lastIndex = props.buckets.length - 1
  const totalGrow = props.buckets.reduce((sum, bucket) => sum + bucketGrow(bucket), 0)

  let index = props.buckets.findIndex((bucket, i) => {
    const isLast = i === lastIndex
    return rate >= bucket.rangeMin && (isLast ? rate <= bucket.rangeMax : rate < bucket.rangeMax)
  })
  if (index === -1) index = rate < props.buckets[0].rangeMin ? 0 : lastIndex

  const bucket = props.buckets[index]
  const growBefore = props.buckets.slice(0, index).reduce((sum, b) => sum + bucketGrow(b), 0)
  const span = bucket.rangeMax - bucket.rangeMin
  const fractionInBucket = span > 0 ? (rate - bucket.rangeMin) / span : 0
  const fraction =
    totalGrow > 0 ? (growBefore + fractionInBucket * bucketGrow(bucket)) / totalGrow : 0

  const gapsBefore = index
  const totalGaps = lastIndex
  return {
    left: `calc((100% - ${totalGaps * COLUMN_GAP_PX}px) * ${fraction} + ${gapsBefore * COLUMN_GAP_PX}px)`,
  }
}

const myMarkerStyle = computed(() => positionStyle(props.myRate))
const avgLineStyle = computed(() => positionStyle(props.cohortAverageRate))
</script>

<template>
  <div class="card">
    <p class="card__title">달성률 분포</p>
    <p class="card__desc">
      비슷한 자산의 사용자들은 <b>평균 {{ cohortAverageRate }}%</b> 달성 중입니다. <br />(나:
      <b>{{ myRate }}%</b>)
    </p>

    <div class="hist-wrap">
      <div class="hist" :style="{ '--max-count': MAX_SEGMENTS }">
        <div
          v-for="bucket in buckets"
          :key="bucket.rangeMin"
          class="hist__col"
          :style="{ flexGrow: bucketGrow(bucket) }"
        >
          <div class="hist__bar" :style="{ '--count': segmentCount(bucket) }"></div>
        </div>
      </div>
      <span class="hist__avg-line" :style="avgLineStyle" aria-hidden="true"></span>
      <img class="hist__marker" :src="flagImage" :style="myMarkerStyle" alt="내 달성률 위치" />
    </div>

    <!--
      막대 아래 눈금. 각 칸의 시작값을 왼쪽에 붙여 축처럼 읽히게 한다.
      막대와 같은 flexGrow·gap을 써야 눈금이 칸 시작점과 맞는다.
    -->
    <div class="hist__axis" aria-hidden="true">
      <span
        v-for="bucket in buckets"
        :key="bucket.rangeMin"
        class="hist__tick"
        :style="{ flexGrow: bucketGrow(bucket) }"
        >{{ bucket.rangeMin }}</span
      >
      <span class="hist__tick hist__tick--last">100</span>
    </div>
    <p class="hist__unit">단위: 달성률 %</p>

    <p class="hist__legend">
      <span class="hist__legend-dot"></span>나 {{ myRate }}% · 또래 평균 {{ cohortAverageRate }}%
    </p>
  </div>
</template>

<style scoped>
/* 폰트 크기는 rem이 아닌 px로 고정한다.
   루트가 18px/16px로 바뀌면 픽셀 폰트가 그리드에서 어긋나 뭉개진다. */
.card {
  --ink: var(--c-ink);
  --ink-muted: var(--c-ink-muted);
  --forest: var(--c-accent);
  /* 막대는 칸이 쌓인 모양이다. 칸 사이 선을 카드 배경색으로 둬야 칸이 나뉘어 보인다. */
  --bar-body: var(--c-box);
  --bar-line: var(--c-card);

  border: 1px solid var(--c-line);
  border-radius: 14px;
  padding: 16px;
  background: var(--c-card);
  color: var(--ink);
  /* 루트의 145%는 18px 기준으로 계산된 26.1px이 그대로 상속된다.
     단위 없는 값으로 덮어써야 각 요소가 제 폰트 크기로 줄 높이를 계산한다. */
  line-height: 1.45;
  animation: card-rise 0.35s ease-out both;
  animation-delay: 0.06s;
}

.card__title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 700;
}

.card__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
}

.card__desc b {
  font-weight: 700;
  color: var(--forest);
}

.hist-wrap {
  position: relative;
  margin-top: 48px;
}

.hist {
  --segment: 8px;
  --segment-gap: 2px;

  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: calc(var(--max-count) * (var(--segment) + var(--segment-gap)) - var(--segment-gap));
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

/*
  positionStyle()이 flex-grow·gap을 그대로 계산해 넘겨준 left를 그대로 쓴다.
  원본이 8×8 도트라 8의 배수(16px)로 그려야 픽셀이 고르게 나온다.
*/
.hist__marker {
  position: absolute;
  bottom: calc(100% + 4px);
  width: 16px;
  height: 16px;
  transform: translateX(-50%);
  image-rendering: pixelated;
}

/*
  또래 평균 위치를 표시하는 얇은 기준선. 옅은 초록(--c-accent-mid)은 빈 막대 배경과
  거의 구분되지 않아, 텍스트와 같은 톤인 --ink-muted로 대비를 확보한다.
*/
.hist__avg-line {
  position: absolute;
  top: 0;
  bottom: 0;
  border-left: 1px dashed var(--ink-muted);
  opacity: 0.7;
  transform: translateX(-50%);
}

.hist__axis {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}

.hist__tick {
  flex-basis: 0;
  font-size: 10px;
  color: var(--ink-muted);
  font-variant-numeric: tabular-nums;
}

/* 마지막 칸의 끝값. 칸 하나를 차지하지 않도록 폭을 글자만큼만 준다. */
.hist__tick--last {
  flex: none;
}

.hist__unit {
  margin: 3px 0 0;
  font-size: 10px;
  color: var(--ink-muted);
  text-align: right;
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
  background: var(--forest);
}
</style>
