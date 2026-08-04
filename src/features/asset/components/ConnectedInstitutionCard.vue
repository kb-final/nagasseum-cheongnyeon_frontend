<script setup>
import { computed } from 'vue'

const props = defineProps({
  institution: { type: Object, required: true },
})

defineEmits(['delete'])

const shortLabel = computed(() => props.institution.shortName ?? props.institution.name.slice(0, 2))
</script>

<template>
  <div class="connected-institution-card">
    <span class="connected-institution-card__logo">{{ shortLabel }}</span>

    <span class="connected-institution-card__info">
      <span class="connected-institution-card__name">{{ institution.name }}</span>
      <span class="connected-institution-card__category">{{ institution.category }}</span>
    </span>

    <button
      type="button"
      class="connected-institution-card__delete"
      aria-label="연동 해제"
      @click="$emit('delete', institution.id)"
    >
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path
          d="M5 7h14M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.connected-institution-card {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border: 1px solid var(--border, #262626);
  border-radius: 16px;
  background: var(--card-bg, #161616);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease,
    box-shadow 0.18s ease;
}

@media (hover: hover) and (pointer: fine) {
  .connected-institution-card:hover {
    transform: translateY(-2px);
    border-color: var(--accent-border, rgba(227, 255, 232, 0.5));
    background: var(--accent-bg, rgba(227, 255, 232, 0.1));
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.24);
  }
}

.connected-institution-card:active {
  transform: scale(0.98);
  background: var(--accent-bg, rgba(227, 255, 232, 0.1));
  transition-duration: 0.08s;
}

.connected-institution-card__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--border, #262626);
  font-size: 13.2px;
  font-weight: 700;
  color: var(--text-h, #ffffff);
}

.connected-institution-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.connected-institution-card__name {
  font-size: 14.1px;
  font-weight: 500;
  color: var(--text-h, #ffffff);
}

.connected-institution-card__category {
  font-size: 11.1px;
  color: var(--text, #6e756f);
}

.connected-institution-card__delete {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: none;
  color: var(--text, #9aa09a);
  cursor: pointer;
  transition:
    color 0.18s ease,
    background-color 0.18s ease;
}

@media (hover: hover) and (pointer: fine) {
  .connected-institution-card__delete:hover {
    color: #e03131;
    background: rgba(224, 49, 49, 0.12);
  }
}
</style>
