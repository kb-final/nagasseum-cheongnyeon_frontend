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
  padding: 6px;
  border-radius: 30px;
  background: var(--color-nav-bg, #a6c7b7);
  /* 콘텐츠 위에 떠 있는 네비라 배경과 구분되게 옅은 그림자를 준다. */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

.bottom-nav__item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 8px;
  border: none;
  border-radius: 22px;
  background: transparent;
  color: var(--color-nav-inactive, #3e5a49);
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
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

/* 탭이 활성화되는 순간에만 아이콘이 살짝 튀는 정도로 가볍게 준다. */
.bottom-nav__item--active .bottom-nav__icon {
  animation: bottom-nav-icon-pop 0.28s ease;
}

@keyframes bottom-nav-icon-pop {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.18);
  }
  100% {
    transform: scale(1);
  }
}

.bottom-nav__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.bottom-nav__label {
  font-family: var(--sans-normal);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
</style>
