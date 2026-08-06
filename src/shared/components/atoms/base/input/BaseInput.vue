<script setup>
import { nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  size: { type: String, default: 'default' },
})

const emit = defineEmits(['update:modelValue'])

// 부모가 @update:model-value에서 값을 검증/가공(글자 필터링, 최대값 clamp 등)해도
// 결과가 직전 값과 같으면 Vue가 변경을 감지하지 못해 리렌더를 건너뛴다.
// 이 경우 브라우저가 keydown 시 이미 반영해둔 미검증 DOM 값이 그대로 남으므로,
// 매 입력 후 실제 정답(modelValue)과 DOM 값을 강제로 동기화한다.
function onInput(event) {
  emit('update:modelValue', event.target.value)

  nextTick(() => {
    const expected = String(props.modelValue)
    if (event.target.value !== expected) {
      event.target.value = expected
    }
  })
}
</script>

<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    class="base-input"
    :class="`base-input--${size}`"
    @input="onInput"
  />
</template>

<style scoped>
.base-input {
  padding: 8px 12px;
  border: 1px solid var(--border, #e5e4e7);
  border-radius: 6px;
  box-sizing: border-box;
}

.base-input--default {
  width: 100%;
}

.base-input--sm {
  width: 120px;
}

.base-input::-webkit-outer-spin-button,
.base-input::-webkit-inner-spin-button {
  margin: 0;
  appearance: none;
}

.base-input[type='number'] {
  appearance: textfield;
}
</style>
