<script setup>
import BaseBadge from '@/shared/components/atoms/base/badge/BaseBadge.vue'
import BaseDivider from '@/shared/components/atoms/base/divider/BaseDivider.vue'

defineProps({
  policies: { type: Array, required: true },
})

defineEmits(['view-all'])

// 상시 정책이면 "상시" 배지, 아니면 마감일까지 남은 일수로 "D-N" 배지를 계산한다
function ddayLabel(policy) {
  if (policy.applyPeriodType === '상시') return '상시'
  const diffMs = new Date(policy.applyEndDate) - new Date()
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return `D-${days}`
}

function ddayVariant(policy) {
  return policy.applyPeriodType === '상시' ? 'mint' : 'point'
}
</script>

<template>
  <section class="policy-list">
    <div class="policy-list__header">
      <h2 class="policy-list__title">맞춤 정책</h2>
      <button type="button" class="policy-list__more" @click="$emit('view-all')">더보기 ></button>
    </div>

    <template v-for="(policy, index) in policies" :key="policy.id">
      <BaseDivider v-if="index > 0" />
      <div class="policy-list__item">
        <div class="policy-list__item-text">
          <p class="policy-list__item-name">{{ policy.policyName }}</p>
          <p class="policy-list__item-summary">{{ policy.policySummary }}</p>
        </div>
        <BaseBadge :variant="ddayVariant(policy)">{{ ddayLabel(policy) }}</BaseBadge>
      </div>
    </template>
  </section>
</template>

<style scoped>
.policy-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.policy-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.policy-list__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-h, #ffffff);
}

.policy-list__more {
  border: none;
  background: transparent;
  color: var(--text, #9aa09a);
  font-size: 12px;
  cursor: pointer;
}

.policy-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
}

.policy-list__item-text {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
}

.policy-list__item-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-h, #ffffff);
}

.policy-list__item-summary {
  margin-top: -2px;
  font-size: 12px;
  color: var(--text, #9aa09a);
}
</style>
