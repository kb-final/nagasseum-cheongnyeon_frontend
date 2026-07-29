<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import { formatWon } from '@/shared/utils/formatter'

const props = defineProps({
  assetSummary: { type: Object, required: true },
  assetBreakdown: { type: Object, required: true },
})

const tiles = computed(() => [
  {
    label: '예적금',
    amount: props.assetBreakdown.depositSavings.totalAmount,
    sub: `${props.assetBreakdown.depositSavings.accountCount}개 계좌`,
  },
  {
    label: '대출',
    amount: props.assetSummary.loanBalance,
    sub:
      props.assetBreakdown.loan.accountCount > 0
        ? `${props.assetBreakdown.loan.accountCount}개 계좌`
        : '보유 없음',
  },
  {
    label: '고정 저축액',
    amount: props.assetSummary.monthlySavings,
    sub: null,
  },
])
</script>

<template>
  <div class="asset-summary-grid">
    <BaseCard v-for="tile in tiles" :key="tile.label" size="modal" class="asset-summary-grid__tile">
      <span class="asset-summary-grid__label">{{ tile.label }}</span>
      <span class="asset-summary-grid__amount">{{ formatWon(tile.amount) }}</span>
      <span v-if="tile.sub" class="asset-summary-grid__sub">{{ tile.sub }}</span>
    </BaseCard>
  </div>
</template>

<style scoped>
.asset-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.asset-summary-grid__tile {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: var(--color-mint-pale, #cdedd3);
}

.asset-summary-grid__label {
  font-size: 12px;
  color: var(--color-mint-deep, #16281c);
  opacity: 0.7;
}

.asset-summary-grid__amount {
  overflow: hidden;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-mint-deep, #16281c);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.asset-summary-grid__sub {
  font-size: 11px;
  color: var(--color-mint-deep, #16281c);
  opacity: 0.7;
}
</style>
