<script setup>
defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' },
  disabled: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    class="base-button"
    :class="`base-button--${variant}`"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
}

.base-button--primary {
  background: var(--accent, #aa3bff);
  color: #fff;
}

.base-button--secondary {
  background: transparent;
  border-color: var(--border, #e5e4e7);
  color: inherit;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
