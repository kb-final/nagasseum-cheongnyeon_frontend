<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  modelValue: { type: Object, required: true }, // { min, max }
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  step: { type: Number, default: 1 },
  formatValue: { type: Function, default: (v) => v },
})

const emit = defineEmits(['update:modelValue'])

const activeThumb = ref(null)

function onMinInput(event) {
  const next = Math.min(Number(event.target.value), props.modelValue.max)
  emit('update:modelValue', { min: next, max: props.modelValue.max })
}

function onMaxInput(event) {
  const next = Math.max(Number(event.target.value), props.modelValue.min)
  emit('update:modelValue', { min: props.modelValue.min, max: next })
}

function percentOf(value) {
  const range = props.max - props.min
  return range === 0 ? 0 : ((value - props.min) / range) * 100
}

const minPercent = computed(() => percentOf(props.modelValue.min))
const maxPercent = computed(() => percentOf(props.modelValue.max))

const fillStyle = computed(() => ({
  left: `${minPercent.value}%`,
  width: `${Math.max(maxPercent.value - minPercent.value, 0)}%`,
}))
</script>

<template>
  <div class="range-slider">
    <div v-if="label" class="range-slider__label-row">
      <span class="range-slider__label">{{ label }}</span>
      <span class="range-slider__value">
        {{ formatValue(modelValue.min) }} ~ {{ formatValue(modelValue.max) }}
      </span>
    </div>
    <div class="range-slider__track-wrap">
      <div class="range-slider__track" />
      <div class="range-slider__fill" :style="fillStyle" />
      <!--
        보이는 손잡이. 실제 조작은 아래 투명한 네이티브 input이 담당하고, 이 두 개는
        위치만 따라 그린다(pointer-events: none).
      -->
      <span
        class="range-slider__thumb"
        :class="{ 'range-slider__thumb--active': activeThumb === 'min' }"
        :style="{ left: `${minPercent}%` }"
      />
      <span
        class="range-slider__thumb"
        :class="{ 'range-slider__thumb--active': activeThumb === 'max' }"
        :style="{ left: `${maxPercent}%` }"
      />
      <input
        type="range"
        class="range-slider__input"
        :class="{ 'range-slider__input--active': activeThumb === 'min' }"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue.min"
        @input="onMinInput"
        @pointerdown="activeThumb = 'min'"
      />
      <input
        type="range"
        class="range-slider__input"
        :class="{ 'range-slider__input--active': activeThumb === 'max' }"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue.max"
        @input="onMaxInput"
        @pointerdown="activeThumb = 'max'"
      />
    </div>
  </div>
</template>

<style scoped>
.range-slider {
  width: 100%;
}

.range-slider__label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  font-weight: 700;
}

.range-slider__label {
  color: var(--text-h, #ffffff);
}

.range-slider__value {
  color: var(--text, #9aa09a);
  font-weight: 400;
}

/* 손잡이가 트랙 세로 중앙에 걸치므로, 위아래로 손잡이 절반 높이만큼 여백이 필요하다. */
.range-slider__track-wrap {
  position: relative;
  height: 4px;
  margin: 16px 0;
}

.range-slider__track {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: var(--border, #262626);
}

.range-slider__fill {
  position: absolute;
  top: 0;
  height: 4px;
  border-radius: 2px;
  background: #e3ffe8;
}

/*
  손잡이. 채움색과 같은 색으로 칠하고 표면색 테두리를 둘러 트랙 위에서 떠 보이게 한다.
  --base-button-primary-bg는 테마에 따라 뒤집히므로(라이트 진초록 / 다크 밝은 민트)
  두 테마 모두에서 트랙과 구분된다.
*/
.range-slider__thumb {
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-surface, #161616);
  border-radius: 50%;
  background: var(--base-button-primary-bg, #e3ffe8);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2;
}

/* 두 손잡이가 겹쳤을 때 방금 잡은 쪽이 위로 온다 */
.range-slider__thumb--active {
  z-index: 3;
}

/* 네이티브 range를 쓰면 키보드·터치 조작이 공짜로 따라온다.
   손잡이 자체는 투명하게 숨기고, 위의 .range-slider__thumb로 대신 보여준다. */
.range-slider__input {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 28px;
  margin: 0;
  background: transparent;
  appearance: none;
  pointer-events: none;
  transform: translateY(-50%);
  z-index: 1;
}

.range-slider__input--active {
  z-index: 2;
}

.range-slider__input::-webkit-slider-runnable-track {
  height: 28px;
  background: transparent;
}

.range-slider__input::-moz-range-track {
  height: 28px;
  background: transparent;
}

.range-slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  pointer-events: auto;
  cursor: pointer;
}

.range-slider__input::-moz-range-thumb {
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  pointer-events: auto;
  cursor: pointer;
}
</style>
