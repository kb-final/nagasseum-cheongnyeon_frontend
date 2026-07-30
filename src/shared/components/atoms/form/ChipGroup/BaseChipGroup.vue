<script setup>
defineProps({
  label: { type: String, default: '' },
  options: { type: Array, required: true },
  modelValue: { type: [String, Number, null], default: null },
  size: { type: String, default: 'default' },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="chip-group">
    <div v-if="label" class="chip-group__label">
      {{ label }} <span class="chip-group__count">(1개)</span>
    </div>
    <div class="chip-group__items" :class="`chip-group__items--${size}`">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="chip-group__item"
        :class="[
          `chip-group__item--${size}`,
          { 'chip-group__item--active': option.value === modelValue },
        ]"
        @click="$emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.chip-group {
  width: 100%;
}

.chip-group__label {
  margin-bottom: 16px;
  font-weight: 700;
  color: var(--text-h, #ffffff);
}

.chip-group__count {
  font-weight: 400;
  color: var(--text, #9aa09a);
}

.chip-group__items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.chip-group__items--sm {
  gap: 8px;
}

.chip-group__item {
  border: 1px solid #333333;
  border-radius: 999px;
  background: var(--card-bg, #161616);
  color: var(--text, #9aa09a);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.chip-group__item--default {
  padding: 20px 28px;
}

.chip-group__item--sm {
  padding: 10px 18px;
  font-size: 14px;
}

.chip-group__item--active {
  border-color: transparent;
  background: #e3ffe8;
  color: var(--color-mint-deep, #16281c);
}
</style>
