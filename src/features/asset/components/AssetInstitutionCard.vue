<script setup>
import { computed } from 'vue'

const props = defineProps({
  institution: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})

defineEmits(['toggle'])

const shortLabel = computed(() => props.institution.shortName ?? props.institution.name.slice(0, 2))
</script>

<template>
  <button
    type="button"
    class="asset-institution-card"
    :class="{ 'asset-institution-card--selected': selected }"
    :aria-pressed="selected"
    @click="$emit('toggle', institution.id)"
  >
    <span class="asset-institution-card__logo">{{ shortLabel }}</span>

    <span class="asset-institution-card__info">
      <span class="asset-institution-card__name">{{ institution.name }}</span>
      <span class="asset-institution-card__category">{{ institution.category }}</span>
    </span>

    <span class="asset-institution-card__indicator">
      <svg v-if="selected" viewBox="0 0 16 16" width="12" height="12">
        <path
          d="M3 8.5L6.5 12L13 4.5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
  </button>
</template>

<style scoped>
.asset-institution-card {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border: 1px solid var(--border, #262626);
  border-radius: 16px;
  background: var(--card-bg, #161616);
  cursor: pointer;
  text-align: left;
}

.asset-institution-card--selected {
  border-color: var(--accent-border, rgba(227, 255, 232, 0.5));
  background: var(--accent-bg, rgba(227, 255, 232, 0.1));
}

.asset-institution-card__logo {
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

.asset-institution-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.asset-institution-card__name {
  font-size: 14.1px;
  font-weight: 500;
  color: var(--text-h, #ffffff);
}

.asset-institution-card__category {
  font-size: 11.1px;
  color: var(--text, #6e756f);
}

.asset-institution-card__indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: 1px solid var(--color-toggle-off, #383e3a);
  border-radius: 50%;
  color: var(--color-mint-deep, #16281c);
}

.asset-institution-card--selected .asset-institution-card__indicator {
  border-color: transparent;
  background: var(--color-mint-strong, #c1e8c8);
}
</style>
