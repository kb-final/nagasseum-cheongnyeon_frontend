<script setup>
/** 바는 연속 게이지가 아니라 10칸 분절 게이지다. 한 칸 = 10%. */
const SEGMENT_COUNT = 10

defineProps({
  topDealType: { type: String, required: true },
  topDealRatio: { type: Number, required: true },
  items: { type: Array, required: true }, // [{ dealType, label, ratio, rank }]
})

const filledCount = (ratio) => Math.round((ratio / 100) * SEGMENT_COUNT)
</script>

<template>
  <div class="card">
    <p class="card__title">목표 유형 분포</p>
    <p class="card__desc">
      나와 비슷한 자산 보유자들은 <br /><b>{{ topDealType }}({{ topDealRatio }}%)</b>를 가장 많이
      목표로 합니다
    </p>
    <div class="bar-list">
      <div v-for="item in items" :key="item.dealType" class="bar-row">
        <div class="bar-row__head">
          <span class="bar-row__label">{{ item.label }}</span>
          <span v-if="item.rank === 1" class="bar-row__badge">1위</span>
          <span class="bar-row__value">{{ item.ratio }}%</span>
        </div>
        <div
          class="bar-row__track"
          :class="{ 'bar-row__track--top': item.rank === 1 }"
          aria-hidden="true"
        >
          <span
            v-for="n in SEGMENT_COUNT"
            :key="n"
            class="bar-row__segment"
            :class="{ 'bar-row__segment--on': n <= filledCount(item.ratio) }"
          ></span>
        </div>
      </div>
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
  --forest: #1d6b3f;
  --forest-soft: #7fae89;
  --segment: #d9dcc0;
  --badge: #ffd939;

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

.bar-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.bar-row__head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.bar-row__badge {
  display: inline-flex;
  align-items: center;
  height: 12px;
  border-radius: 999px;
  padding: 0 5px;
  background: var(--badge);
  font-size: 10px;
  line-height: 1;
}

.bar-row__value {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
}

.bar-row__track {
  display: flex;
  gap: 3px;
  margin-top: 4px;
}

.bar-row__segment {
  flex: 1;
  height: 12px;
  border-radius: 3px;
  background: var(--segment);
}

.bar-row__segment--on {
  background: var(--forest-soft);
}

.bar-row__track--top .bar-row__segment--on {
  background: var(--forest);
}
</style>
