<script setup>
defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: true },
})

defineEmits(['back'])
</script>

<template>
  <header class="app-header">
    <button
      v-if="showBack"
      type="button"
      class="app-header__back"
      aria-label="뒤로가기"
      @click="$emit('back')"
    >
      <svg viewBox="0 0 12 12" width="12" height="12">
        <path
          d="M8 1L2 6L8 11"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <span v-else class="app-header__spacer" />
    <h1 class="app-header__title">{{ title }}</h1>
    <!-- 3열 grid라 좌/우 폭이 달라도(예: "수정하기") 제목은 항상 가운데 칸에 고정된다 -->
    <div class="app-header__action">
      <slot name="action" />
    </div>
  </header>
</template>

<style scoped>
/*
  좌/우 칸을 1fr로 잡아 폭이 서로 달라도(예: "수정하기"처럼 스페이서보다 넓은 액션)
  가운데 칸(제목)이 항상 화면 정중앙에 오게 한다. flex space-between이었을 때는
  오른쪽 액션이 왼쪽 스페이서보다 넓으면 제목이 살짝 왼쪽으로 밀렸었다.
*/
.app-header {
  display: grid;
  /* minmax(0, 1fr): "수정하기"처럼 액션 쪽 내용이 넓어도 트랙이 그 내용만큼 늘어나지
     않게 강제로 좌우를 같은 폭으로 묶는다. 그냥 1fr이면 fr 트랙의 기본 최소 크기가
     content 크기라서, 넓은 쪽 트랙이 커져 제목이 중앙에서 밀렸다. */
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  width: 100%;
  padding: 12px 0;
  /* 스크롤해도 화면 위에 계속 떠 있게 한다. 배경을 페이지 배경과 같은 색으로 채워야
     아래 콘텐츠가 뒤로 비치지 않는다. 하단 탭(z-index: 10)보다는 아래에 둔다. */
  position: sticky;
  top: 0;
  z-index: 5;
  background: var(--color-app-bg, #111111);
  border-bottom: 1px solid var(--color-border, #262626);
}

.app-header__back {
  display: flex;
  align-items: center;
  justify-content: center;
  justify-self: start;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: none;
  color: var(--color-text-primary, #ffffff);
  cursor: pointer;
}

.app-header__title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
}

.app-header__spacer {
  width: 24px;
  height: 24px;
  justify-self: start;
}

.app-header__action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 24px;
  height: 24px;
  justify-self: end;
}
</style>
