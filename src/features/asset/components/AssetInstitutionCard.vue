<script setup>
import InstitutionCardBase from '@/features/asset/components/InstitutionCardBase.vue'

defineProps({
  institution: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})

defineEmits(['toggle'])
</script>

<template>
  <InstitutionCardBase
    as="button"
    class="asset-institution-card"
    :institution="institution"
    :selected="selected"
    @click="$emit('toggle', institution.id)"
  >
    <template #action>
      <span
        class="asset-institution-card__indicator"
        :class="{ 'asset-institution-card__indicator--selected': selected }"
      >
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
    </template>
  </InstitutionCardBase>
</template>

<style scoped>
.asset-institution-card {
  cursor: pointer;
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

.asset-institution-card__indicator--selected {
  border-color: transparent;
  background: var(--color-mint-strong, #c1e8c8);
}
</style>
