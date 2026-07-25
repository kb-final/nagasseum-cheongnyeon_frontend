<script setup>
import BaseFieldBadge from '@/shared/components/atoms/base/badge/BaseFieldBadge.vue'
import BaseInput from '@/shared/components/atoms/base/input/BaseInput.vue'

defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="base-input-field">
    <div v-if="label" class="base-input-field__label-row">
      <span class="base-input-field__label">{{ label }}</span>
      <BaseFieldBadge :required="required" />
    </div>
    <BaseInput
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<style scoped>
.base-input-field {
  width: 100%;
}

.base-input-field__label-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.base-input-field__label {
  color: var(--text-h, #ffffff);
  font-weight: 500;
}
</style>
