<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import { formatNumber } from '@/shared/utils/formatter'

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
      <span class="asset-summary-grid__amount">
        {{ formatNumber(tile.amount) }}<span class="asset-summary-grid__unit">원</span>
      </span>
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

/*
  글자색 두 단계. 금액은 진하게, 라벨과 보조 설명은 흐리게.
  opacity 대신 색을 직접 준다. 투명도로 흐리게 하면 배경색이 바뀔 때 같이 흔들린다.
  (main.css의 [data-theme] 블록에서 테마별 값을 정의한다.)
*/
.asset-summary-grid__tile {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border-radius: 16px;
  background: var(--asset-tile-surface, #cdedd3);
  letter-spacing: 0.02em;
  /* 루트에서 상속되는 26.1px 고정 줄 높이를 글자 크기에 맞춰 다시 계산시킨다. */
  line-height: 1.25;
}

/*
  항목 이름은 아래 설명("4개 계좌")보다 한 단계 진하게. 셋이 같은 톤이면
  뭐가 제목이고 뭐가 부연인지 구분이 안 된다.
*/
.asset-summary-grid__label {
  font-size: 12px;
  color: var(--asset-tile-label, #4f6f5b);
}

.asset-summary-grid__amount {
  overflow: hidden;
  font-size: 14px;
  font-weight: 700;
  color: var(--climb-card-ink, #12281c);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* 단위는 숫자보다 작고 가볍게. 세 칸이 좁아서 금액이 먼저 읽혀야 한다. */
.asset-summary-grid__unit {
  margin-left: 3px;
  font-size: 11px;
  font-weight: 400;
}

.asset-summary-grid__sub {
  font-size: 11px;
  color: var(--asset-tile-ink-muted, #6f8b79);
}
</style>
