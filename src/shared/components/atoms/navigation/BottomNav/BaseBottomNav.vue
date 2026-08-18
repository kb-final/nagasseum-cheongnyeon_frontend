<script setup>
defineProps({
  items: { type: Array, required: true },
  modelValue: { type: Number, default: 0 },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <nav class="bottom-nav">
    <span
      v-if="modelValue >= 0"
      class="bottom-nav__indicator"
      :style="{
        width: `calc((100% - 12px) / ${items.length})`,
        transform: `translateX(${modelValue * 100}%)`,
      }"
    />
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
  position: relative;
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

/*
  탭마다 따로 배경을 켜고 끄는 대신, 알약 배경 하나를 활성 탭 위치로 슬라이드시킨다.
  translateX(%)는 자기 자신의 너비 기준이라 인덱스만큼 곱하면 정확히 그 탭 자리로 간다.
*/
.bottom-nav__indicator {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 6px;
  border-radius: 22px;
  background: var(--color-nav-active-bg, #e3ffe8);
  transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}

.bottom-nav__item {
  position: relative;
  z-index: 1;
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
  transition: color 0.18s ease;
}

.bottom-nav__item--active {
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
