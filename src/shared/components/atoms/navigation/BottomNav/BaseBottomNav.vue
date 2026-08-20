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
        width: `calc((100% - 12px) / ${items.length} - 12px)`,
        left: `calc(5px + (100% - 12px) / ${items.length} * ${modelValue} + 6px)`,
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
  /* 전체 버튼 시스템이 슬림해진 만큼 네비도 같이 낮춘다(기존 대비 세로 높이 약 12% 감소).
     touch 영역이 부족해지지 않도록 item 쪽 padding까지 함께 줄이되 아이콘/라벨 사이
     간격은 답답하지 않게 최소치를 남겨둔다. */
  padding: 5px;
  border-radius: 26px;
  background: var(--color-nav-bg, #a6c7b7);
  /* 콘텐츠 카드(0 2px 6px / 0.06)보다 아주 살짝 더 뚜렷하게 줘서 카드가 아니라
     그 위에 떠 있는 별도 조작 레이어처럼 보이게 한다. 위쪽 방향 그림자를 함께 줘서
     뒤로 지나가는 콘텐츠와 경계가 느껴지게 한다 — 여전히 과하지 않은 수준으로. */
  box-shadow:
    0 -2px 8px rgba(0, 0, 0, 0.05),
    0 3px 10px rgba(0, 0, 0, 0.09);
  box-sizing: border-box;
}

/*
  탭마다 따로 배경을 켜고 끄는 대신, 알약 배경 하나를 활성 탭 위치로 슬라이드시킨다.
  배경을 각 탭 슬롯보다 좌우로 살짝 좁게 만들기 위해 width/left를 모두 인라인에서
  계산한다 — 슬롯 폭(=아이템 클릭 영역)과 배경 폭을 분리하면 더 이상 자기 자신의
  너비 기준인 translateX(%)로는 정확한 위치가 나오지 않아, left를 직접 이동시킨다.
*/
.bottom-nav__indicator {
  position: absolute;
  top: 6px;
  bottom: 6px;
  border-radius: 20px;
  background: var(--color-nav-active-bg, #e3ffe8);
  transition: left 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}

.bottom-nav__item {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  /* 세로 패딩만 줄인다 — 좌우까지 좁히면 4개 항목이 붙어 보여 탭 실수 위험이 커진다. */
  padding: 6px 8px;
  border: none;
  border-radius: 20px;
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
  width: 16px;
  height: 16px;
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
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
}
</style>
