<script setup>
import { computed } from 'vue'

import { formatWon } from '@/shared/utils/formatter'

import defaultIcon from '@/assets/images/asset/default.png'
import generalIcon from '@/assets/images/asset/general.png'
import investmentIcon from '@/assets/images/asset/investment.png'
import savingsIcon from '@/assets/images/asset/savings.png'
import subscriptionIcon from '@/assets/images/asset/subscription.png'

const props = defineProps({
  /** accountType. DEMAND / DEPOSIT / SAVINGS / SUBSCRIPTION / FUND / STOCK */
  type: { type: String, default: '' },
  institution: { type: String, default: '' },
  name: { type: String, required: true },
  amount: { type: Number, default: 0 },
})

/**
 * 종류별 아이콘.
 * <p>여기 없는 값은 기본 그림으로 떨어진다. 모르는 코드가 와도 화면이 안 깨진다.
 */
const TYPE_ICONS = {
  DEMAND: generalIcon,
  DEPOSIT: generalIcon,
  SAVINGS: savingsIcon,
  SUBSCRIPTION: subscriptionIcon,
  FUND: investmentIcon,
  STOCK: investmentIcon,
}

/**
 * 화면 표시명.
 */
const TYPE_LABELS = {
  DEMAND: '입출금',
  DEPOSIT: '예금',
  SAVINGS: '적금',
  SUBSCRIPTION: '청약',
  FUND: '펀드',
  STOCK: '주식',
  FOREIGN_CURRENCY: '외화',
  MANUAL: '직접 등록',
}

const icon = computed(() => TYPE_ICONS[props.type] ?? defaultIcon)

// 모르는 코드는 코드를 그대로 보여준다. 빈칸보다 낫고, 뭐가 빠졌는지도 드러난다.
// 값이 아예 없을 때만 '기타'로 떨어뜨린다. (?? 는 빈 문자열을 걸러주지 않는다)
const label = computed(() => TYPE_LABELS[props.type] || props.type || '기타')
</script>

<template>
  <div class="item-tile">
    <img class="item-tile__icon" :src="icon" alt="" />

    <div class="item-tile__body">
      <p class="item-tile__name">{{ name }}</p>
      <p class="item-tile__meta">
        <span class="item-tile__type">{{ label }}</span>
        <span v-if="institution" class="item-tile__institution">{{ institution }}</span>
      </p>
    </div>

    <span class="item-tile__amount">{{ formatWon(amount) }}</span>
  </div>
</template>

<style scoped>
.item-tile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 11px;
  border: 1px solid #334234;
  background: #171b16;
  /* 루트의 145%가 26.1px 고정으로 상속된다. 글자가 작아 그대로 두면 너무 벌어진다. */
  line-height: 1.3;
}

.item-tile__icon {
  flex: none;
  width: 30px;
  height: 30px;
  image-rendering: pixelated;
}

.item-tile__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.item-tile__name {
  overflow: hidden;
  margin: 0;
  color: #e8f0e6;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-tile__meta {
  display: flex;
  align-items: center;
  gap: 5px;
  overflow: hidden;
  margin: 0;
}

.item-tile__type {
  flex: none;
  padding: 1px 5px;
  background: rgba(159, 216, 171, 0.14);
  color: #9fd8ab;
  font-size: 9.5px;
  font-weight: 700;
}

.item-tile__institution {
  overflow: hidden;
  color: #7fa398;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-tile__amount {
  flex: none;
  color: #ffd939;
  font-size: 12.5px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
</style>
