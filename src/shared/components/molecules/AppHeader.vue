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
    <span class="app-header__spacer" />
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 0;
}

.app-header__back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: none;
  color: var(--text-h, #ffffff);
  cursor: pointer;
}

.app-header__title {
  margin: 0;
  font-size: 15.9px;
  font-weight: 400;
  color: var(--text-h, #ffffff);
}

.app-header__spacer {
  width: 24px;
  height: 24px;
}
</style>
