<script setup>
import { ref, computed } from 'vue'

import runnerImage from '@/features/compare/assets/runner.png'

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
      <img
        class="range-slider__runner"
        :class="{ 'range-slider__runner--active': activeThumb === 'min' }"
        :src="runnerImage"
        alt=""
        :style="{ left: `${minPercent}%` }"
      />
      <img
        class="range-slider__runner range-slider__runner--flipped"
        :class="{ 'range-slider__runner--active': activeThumb === 'max' }"
        :src="runnerImage"
        alt=""
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

/* 캐릭터가 트랙 세로 중앙에 걸치므로, 위아래로 캐릭터 절반 높이만큼 여백이 필요하다. */
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

.range-slider__runner {
  position: absolute;
  top: 50%;
  width: 30px;
  height: 30px;
  transform: translate(-50%, -50%);
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
  pointer-events: none;
  z-index: 2;
}

.range-slider__runner--flipped {
  transform: translate(-50%, -50%) scaleX(-1);
}

.range-slider__runner--active {
  z-index: 3;
}

/* 네이티브 range를 쓰면 키보드·터치 조작이 공짜로 따라온다.
   손잡이 자체는 투명하게 숨기고, 캐릭터 이미지(.range-slider__runner)로 대신 보여준다. */
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
