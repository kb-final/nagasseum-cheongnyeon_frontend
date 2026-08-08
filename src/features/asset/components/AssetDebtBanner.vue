<script setup>
import { computed } from 'vue'

import { formatWon } from '@/shared/utils/formatter'

import loanIcon from '@/assets/images/asset/loan.png'

const props = defineProps({
  /** assetStore가 만든 대출 목록 ({ id, name, subLabel, amount }) */
  loans: { type: Array, default: () => [] },
})

const totalBalance = computed(() =>
  props.loans.reduce((total, loan) => total + (loan.amount ?? 0), 0),
)
</script>

<template>
  <!-- 대출이 없으면 배너 자체를 띄우지 않는다. -->
  <section v-if="loans.length > 0" class="debt">
    <div class="debt__head">
      <img class="debt__icon" :src="loanIcon" alt="" />
      <span class="debt__title">디버프 · 대출</span>
      <span class="debt__total">-{{ formatWon(totalBalance) }}</span>
    </div>

    <ul class="debt__list">
      <li v-for="loan in loans" :key="loan.id" class="debt__item">
        <span class="debt__item-name">{{ loan.name }}</span>
        <span class="debt__item-amount">-{{ formatWon(loan.amount) }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
/*
  대출만 빨강
*/
.debt {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 11px 12px;
  border: 1px solid #5c2f28;
  background: #1e1512;
  line-height: 1.35;
}

.debt__head {
  display: flex;
  align-items: center;
  gap: 6px;
}

.debt__icon {
  width: 22px;
  height: 22px;
  image-rendering: pixelated;
}

.debt__title {
  flex: 1;
  color: #e2735f;
  font-size: 12px;
  font-weight: 700;
}

.debt__total {
  color: #e2735f;
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.debt__list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.debt__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 11px;
}

.debt__item-name {
  overflow: hidden;
  color: #c7b3ad;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.debt__item-amount {
  flex: none;
  color: #c7b3ad;
  font-variant-numeric: tabular-nums;
}
</style>
