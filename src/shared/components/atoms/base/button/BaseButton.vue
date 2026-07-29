<script setup>
defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'lg' },
  disabled: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  border: 1px solid transparent;
  cursor: pointer;
}

.base-button--md {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 53px;
  padding: 0 8px;
  border-radius: 15px;
}

.base-button--lg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 53px;
  padding: 0 16px;
  border-radius: 15px;
  font-weight: 700;
}

.base-button--modal {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  padding: 0 16px;
  border-radius: 14px;
  font-weight: 700;
}

.base-button--primary {
  background: var(--accent, #aa3bff);
  color: var(--color-mint-deep, #16281c);
}

.base-button--secondary {
  background: #2a2a2a;
  color: #e3ffe8;
}

.base-button--dark {
  background: var(--color-mint-deep, #16281c);
  color: var(--color-card-highlight, #f7ffd1);
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
