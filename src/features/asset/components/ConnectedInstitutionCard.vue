<script setup>
import InstitutionCardBase from '@/features/asset/components/InstitutionCardBase.vue'

defineProps({
  institution: { type: Object, required: true },
})

defineEmits(['delete'])
</script>

<template>
  <InstitutionCardBase class="connected-institution-card" :institution="institution">
    <template #action>
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
    </template>
  </InstitutionCardBase>
</template>

<style scoped>
.connected-institution-card {
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease,
    box-shadow 0.18s ease;
}

@media (hover: hover) and (pointer: fine) {
  .connected-institution-card:hover {
    transform: translateY(-2px);
    border-color: var(--color-primary);
    background: var(--color-primary-soft);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.24);
  }
}

.connected-institution-card:active {
  transform: scale(0.98);
  background: var(--color-primary-soft);
  transition-duration: 0.08s;
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
  color: var(--color-text-secondary);
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
