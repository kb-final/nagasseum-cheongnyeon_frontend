<script setup>
import { computed } from 'vue'

const props = defineProps({
  institution: { type: Object, required: true },
  as: { type: String, default: 'div' },
  selected: { type: Boolean, default: false },
})

defineEmits(['click'])

const shortLabel = computed(() => props.institution.shortName ?? props.institution.name.slice(0, 2))
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? 'button' : undefined"
    :aria-pressed="as === 'button' ? selected : undefined"
    class="institution-card"
    :class="{ 'institution-card--selected': selected }"
    @click="$emit('click')"
  >
    <span class="institution-card__logo">{{ shortLabel }}</span>

    <span class="institution-card__info">
      <span class="institution-card__name">{{ institution.name }}</span>
      <span class="institution-card__category">{{ institution.category }}</span>
    </span>

    <slot name="action" />
  </component>
</template>

<style scoped>
.institution-card {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border: 1px solid var(--border, #262626);
  border-radius: 16px;
  background: var(--card-bg, #161616);
  text-align: left;
}

.institution-card--selected {
  border-color: var(--accent-border, rgba(227, 255, 232, 0.5));
  background: var(--accent-bg, rgba(227, 255, 232, 0.1));
}

.institution-card__logo {
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

.institution-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.institution-card__name {
  font-size: 14.1px;
  font-weight: 500;
  color: var(--text-h, #ffffff);
}

.institution-card__category {
  font-size: 11.1px;
  color: var(--text, #6e756f);
}
</style>
