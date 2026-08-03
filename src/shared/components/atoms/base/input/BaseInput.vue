<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  size: { type: String, default: 'default' },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    class="base-input"
    :class="`base-input--${size}`"
    @input="$emit('update:modelValue', $event.target.value)"
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
