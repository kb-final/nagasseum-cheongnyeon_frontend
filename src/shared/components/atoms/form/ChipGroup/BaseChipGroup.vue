<script setup>
defineProps({
  label: { type: String, default: '' },
  options: { type: Array, required: true },
  modelValue: { type: [String, Number, null], default: null },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="chip-group">
    <div v-if="label" class="chip-group__label">
      {{ label }} <span class="chip-group__count">(1개)</span>
    </div>
    <div class="chip-group__items">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="chip-group__item"
        :class="{ 'chip-group__item--active': option.value === modelValue }"
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

.chip-group__item {
  padding: 20px 28px;
  border: none;
  border-radius: 999px;
  background: var(--card-bg, #161616);
  color: var(--text, #9aa09a);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.chip-group__item--active {
  background: var(--color-mint-strong, #c1e8c8);
  color: var(--color-mint-deep, #16281c);
}
</style>
