<script setup>
defineProps({
  size: { type: String, default: 'lg' },
})
</script>

<template>
  <div class="base-card" :class="`base-card--${size}`">
    <slot />
  </div>
</template>

<style scoped>
.base-card {
  box-sizing: border-box;
  width: 100%;
  background: var(--color-surface, #161616);
}

.base-card--lg {
  padding: 20px;
  border-radius: 16px;
}

.base-card--modal {
  padding: 16px;
  border-radius: 12px;
}
</style>
