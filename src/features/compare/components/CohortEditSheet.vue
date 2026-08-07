<script setup>
import { computed, ref } from 'vue'

import { filterEligibleCohortTypes } from '@/features/compare/composables/useCohortFilter'

import runnerImage from '@/features/compare/assets/runner.png'

const ASSET = { min: 5_000_000, max: 30_000_000, step: 1_000_000 }
const AGE = { min: 1, max: 5, step: 1 }

const props = defineProps({
  assetRange: { type: Number, required: true },
  ageRange: { type: Number, required: true },
  cohortTypes: { type: Array, default: () => [] },
  hasIncomeInfo: { type: Boolean, default: true },
  hasOccupationInfo: { type: Boolean, default: true },
})

const emit = defineEmits(['apply', 'close'])

const draftAsset = ref(props.assetRange)
const draftAge = ref(props.ageRange)
const draftTypes = ref(
  filterEligibleCohortTypes(props.cohortTypes, {
    hasIncomeInfo: props.hasIncomeInfo,
    hasOccupationInfo: props.hasOccupationInfo,
  }),
)

const missingInfoLabel = computed(() => {
  const missing = []
  if (!props.hasIncomeInfo) missing.push('소득')
  if (!props.hasOccupationInfo) missing.push('직업')
  return missing.join('·')
})

const manwon = (won) => (won / 10000).toLocaleString()

const percent = (value, { min, max }) => `${((value - min) / (max - min)) * 100}%`

const assetPct = computed(() => percent(draftAsset.value, ASSET))
const agePct = computed(() => percent(draftAge.value, AGE))

function apply() {
  emit('apply', {
    assetRange: draftAsset.value,
    ageRange: draftAge.value,
    cohortTypes: draftTypes.value,
  })
}
</script>

<template>
  <div class="sheet-layer">
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
        <div class="slider" :style="{ '--pct': assetPct }">
          <div class="slider__track"></div>
          <input
            v-model.number="draftAsset"
            class="slider__input"
            type="range"
            :min="ASSET.min"
            :max="ASSET.max"
            :step="ASSET.step"
            aria-label="자산 범위"
          />
        </div>
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
        <div class="slider" :style="{ '--pct': agePct }">
          <div class="slider__track"></div>
          <input
            v-model.number="draftAge"
            class="slider__input"
            type="range"
            :min="AGE.min"
            :max="AGE.max"
            :step="AGE.step"
            aria-label="나이 범위"
          />
        </div>
        <div class="field__scale">
          <span>{{ AGE.min }}세</span>
          <span>{{ AGE.max }}세</span>
        </div>
      </div>

      <div class="field">
        <div class="field__head">
          <span>추가 조건</span>
        </div>
        <div class="checkbox-group">
          <label class="checkbox" :class="{ 'checkbox--disabled': !hasIncomeInfo }">
            <input v-model="draftTypes" type="checkbox" value="INCOME" :disabled="!hasIncomeInfo" />
            소득 구간
          </label>
          <label class="checkbox" :class="{ 'checkbox--disabled': !hasOccupationInfo }">
            <input
              v-model="draftTypes"
              type="checkbox"
              value="OCCUPATION"
              :disabled="!hasOccupationInfo"
            />
            직업군
          </label>
        </div>
        <p v-if="missingInfoLabel" class="field__note">
          마이페이지에서 {{ missingInfoLabel }} 정보를 등록하면 사용할 수 있어요.
        </p>
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

.slider {
  --thumb-size: 24px;

  position: relative;
  height: var(--thumb-size);
  margin-top: 6px;
}

.slider__track {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 3px;
  transform: translateY(-50%);
  background: linear-gradient(to right, var(--track-fill) 0 var(--pct), var(--track) var(--pct));
}

.slider__input {
  -webkit-appearance: none;
  appearance: none;
  position: absolute;
  top: 0;
  left: calc(var(--thumb-size) / -2);
  width: calc(100% + var(--thumb-size));
  height: var(--thumb-size);
  margin: 0;
  background: transparent;
  cursor: pointer;
}

.slider__input::-webkit-slider-runnable-track {
  height: var(--thumb-size);
  background: transparent;
}

.slider__input::-moz-range-track {
  height: var(--thumb-size);
  background: transparent;
}

.slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: var(--thumb-size);
  height: var(--thumb-size);
  border: 0;
  background: var(--thumb) center / contain no-repeat;
  image-rendering: pixelated;
}

.slider__input::-moz-range-thumb {
  width: var(--thumb-size);
  height: var(--thumb-size);
  border: 0;
  background: var(--thumb) center / contain no-repeat;
  image-rendering: pixelated;
}

.checkbox-group {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 7px 12px;
  background: var(--dark);
  color: #f0f2ef;
  font-size: 12px;
  cursor: pointer;
}

.checkbox input {
  margin: 0;
  accent-color: var(--track-fill);
}

.checkbox--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.checkbox--disabled input {
  cursor: not-allowed;
}

.field__note {
  margin: 6px 0 0;
  font-size: 10.5px;
  color: var(--ink-muted);
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
