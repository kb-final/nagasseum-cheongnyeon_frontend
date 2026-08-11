<script setup>
defineProps({
  items: { type: Array, required: true },
  modelValue: { type: Number, default: 0 },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <nav class="bottom-nav">
    <button
      v-for="(item, index) in items"
      :key="item.label"
      type="button"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': index === modelValue }"
      @click="$emit('update:modelValue', index)"
    >
      <span class="bottom-nav__icon">
        <component :is="item.icon" v-if="item.icon" />
      </span>
      <span class="bottom-nav__label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px;
  border-radius: 30px;
  background: var(--color-nav-bg, #a6c7b7);
  box-sizing: border-box;
}

.bottom-nav__item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 8px;
  border: none;
  border-radius: 22px;
  background: transparent;
  color: var(--color-nav-inactive, #3e5a49);
  cursor: pointer;
}

.bottom-nav__item--active {
  background: var(--color-nav-active-bg, #e3ffe8);
  color: var(--color-nav-active, #16281c);
}

.bottom-nav__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
}

.bottom-nav__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.bottom-nav__label {
  font-size: 12px;
  white-space: nowrap;
}
</style>
