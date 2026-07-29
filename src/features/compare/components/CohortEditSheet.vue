<script setup>
import { computed, ref } from 'vue'

import runnerImage from '@/features/compare/assets/runner.png'

const ASSET = { min: 5_000_000, max: 30_000_000, step: 1_000_000 }
const AGE = { min: 1, max: 5, step: 1 }

const props = defineProps({
  assetRange: { type: Number, required: true },
  ageRange: { type: Number, required: true },
})

const emit = defineEmits(['apply', 'close'])

// 취소하면 되돌려야 하므로 원본을 건드리지 않고 사본으로 조작한다.
const draftAsset = ref(props.assetRange)
const draftAge = ref(props.ageRange)

const manwon = (won) => (won / 10000).toLocaleString()

/** 채워진 트랙 길이. input 배경 그라데이션의 경계로 쓴다. */
const percent = (value, { min, max }) => `${((value - min) / (max - min)) * 100}%`

const assetPct = computed(() => percent(draftAsset.value, ASSET))
const agePct = computed(() => percent(draftAge.value, AGE))

function apply() {
  emit('apply', { assetRange: draftAsset.value, ageRange: draftAge.value })
}
</script>

<template>
  <div class="sheet-layer">
    <!-- 바깥을 눌러도 닫히게 한다. 시트는 형제 요소라 클릭이 겹치지 않는다. -->
    <div class="sheet-layer__backdrop" @click="emit('close')"></div>

    <section
      class="sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cohort-edit-title"
      :style="{ '--thumb': `url(${runnerImage})` }"
    >
      <h2 id="cohort-edit-title" class="sheet__title">비교 기준 수정</h2>

      <div class="field">
        <div class="field__head">
          <span>자산 범위</span>
          <b>±{{ manwon(draftAsset) }}만원</b>
        </div>
        <input
          v-model.number="draftAsset"
          class="field__slider"
          type="range"
          :min="ASSET.min"
          :max="ASSET.max"
          :step="ASSET.step"
          :style="{ '--pct': assetPct }"
          aria-label="자산 범위"
        />
        <div class="field__scale">
          <span>{{ manwon(ASSET.min) }}만</span>
          <span>{{ manwon(ASSET.max) }}만</span>
        </div>
      </div>

      <div class="field">
        <div class="field__head">
          <span>나이 범위</span>
          <b>±{{ draftAge }}세</b>
        </div>
        <input
          v-model.number="draftAge"
          class="field__slider"
          type="range"
          :min="AGE.min"
          :max="AGE.max"
          :step="AGE.step"
          :style="{ '--pct': agePct }"
          aria-label="나이 범위"
        />
        <div class="field__scale">
          <span>{{ AGE.min }}세</span>
          <span>{{ AGE.max }}세</span>
        </div>
      </div>

      <p class="sheet__hint">
        범위를 넓히면 비교 대상이 늘어나지만<br />유사도는 낮아질 수 있어요.
      </p>

      <div class="sheet__actions">
        <button type="button" class="btn btn--ghost" @click="emit('close')">취소</button>
        <button type="button" class="btn btn--primary" @click="apply">적용하기</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 폰트 크기는 rem이 아닌 px로 고정한다.
   루트가 18px/16px로 바뀌면 픽셀 폰트가 그리드에서 어긋나 뭉개진다. */
.sheet-layer {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.sheet-layer__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
}

.sheet {
  /* 이 시트에서만 쓰는 색 */
  --surface: #becfc7;
  --ink: #16281c;
  --ink-muted: #4e5c50;
  --track: #16281c;
  --track-fill: #e3ffe8;
  --dark: #1c1c1c;
  --on-dark: #9aa09a;

  position: relative;
  width: 100%;
  max-width: 420px;
  padding: 20px 16px 16px;
  border-radius: 20px 20px 0 0;
  background: var(--surface);
  color: var(--ink);
  /* 루트의 145%는 18px 기준으로 계산된 26.1px이 그대로 상속된다.
     단위 없는 값으로 덮어써야 각 요소가 제 폰트 크기로 줄 높이를 계산한다. */
  line-height: 1.45;
}

.sheet__title {
  margin: 0 0 18px;
  font-size: 16px;
  color: var(--ink);
}

.field + .field {
  margin-top: 18px;
}

.field__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 13px;
}

.field__head b {
  font-weight: inherit;
  font-variant-numeric: tabular-nums;
}

.field__scale {
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
  font-size: 10px;
  color: var(--ink-muted);
}

/* 네이티브 range를 쓰면 키보드·터치 조작이 공짜로 따라온다.
   트랙은 배경 그라데이션으로, 손잡이는 캐릭터 이미지로 갈아끼운다. */
.field__slider {
  -webkit-appearance: none;
  appearance: none;
  display: block;
  width: 100%;
  height: 24px;
  margin: 6px 0 0;
  background: linear-gradient(to right, var(--track-fill) 0 var(--pct), var(--track) var(--pct))
    center / 100% 3px no-repeat;
  cursor: pointer;
}

/* 트랙 높이를 손잡이와 같게 잡아야 손잡이가 세로 중앙에 온다. */
.field__slider::-webkit-slider-runnable-track {
  height: 24px;
  background: transparent;
}

.field__slider::-moz-range-track {
  height: 24px;
  background: transparent;
}

.field__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border: 0;
  background: var(--thumb) center / contain no-repeat;
  image-rendering: pixelated;
}

.field__slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border: 0;
  background: var(--thumb) center / contain no-repeat;
  image-rendering: pixelated;
}

.sheet__hint {
  margin: 20px 0 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--dark);
  text-align: center;
  font-size: 11px;
  line-height: 1.5;
  color: var(--on-dark);
}

.sheet__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 12px;
}

.btn {
  border: 0;
  border-radius: 10px;
  padding: 12px 0;
  font-size: 13px;
  cursor: pointer;
}

.btn--ghost {
  background: var(--dark);
  color: #f0f2ef;
}

.btn--primary {
  background: var(--track-fill);
  color: var(--ink);
}
</style>
