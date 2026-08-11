<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import { formatEokManwon, formatManwon } from '@/shared/utils/formatter'

const props = defineProps({
  goal: { type: Object, required: true },
  climb: { type: Object, required: true },
})

/**
 * 카드 한 줄에 들어갈 만큼 줄인 지역명.
 *
 * <p>서버는 "서울특별시 강남구"처럼 시도까지 붙여서 준다. 한 줄에 주거형태·거래유형까지
 * 같이 들어가야 해서 시도는 뗀다.
 *
 * <pre>
 *   서울특별시 강남구      → 강남구
 *   경기도 부천시         → 부천시
 *   경기도 고양시 덕양구    → 고양시 덕양구
 * </pre>
 */
function shortRegionName(regionName) {
  const parts = String(regionName ?? '')
    .trim()
    .split(/\s+/)

  return parts.length > 1 ? parts.slice(1).join(' ') : parts.join(' ')
}

const goalTitle = computed(
  () =>
    `${shortRegionName(props.goal.regionName)} ${props.goal.housingType} ${props.goal.dealType}`,
)
</script>

<template>
  <BaseCard class="active-goal-card">
    <div class="active-goal-card__top">
      <span class="active-goal-card__label">진행 중인 목표</span>
      <RouterLink class="active-goal-card__detail" :to="`/goals/${goal.id}`">자세히 ▷</RouterLink>
    </div>

    <p class="active-goal-card__title">{{ goalTitle }}</p>
    <p class="active-goal-card__subtitle">목표 {{ formatEokManwon(goal.targetAmount) }}</p>

    <div class="active-goal-card__stats">
      <div class="active-goal-card__stat">
        <span class="active-goal-card__stat-label">현재</span>
        <strong class="active-goal-card__stat-value">{{
          formatManwon(climb.currentAmount)
        }}</strong>
      </div>
      <div class="active-goal-card__stat">
        <span class="active-goal-card__stat-label">남은 금액</span>
        <strong class="active-goal-card__stat-value">{{
          formatManwon(climb.remainingAmount)
        }}</strong>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
.active-goal-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.active-goal-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.active-goal-card__label {
  font-size: 13px;
  color: var(--color-text-primary, #10130f);
}

.active-goal-card__detail {
  font-size: 12px;
  color: var(--color-text-tertiary, #8f968c);
  text-decoration: none;
}

.active-goal-card__title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary, #10130f);
}

.active-goal-card__subtitle {
  margin: 0 0 4px;
  font-size: 12px;
  color: var(--color-text-secondary, #5b6358);
}

.active-goal-card__stats {
  display: flex;
  gap: 8px;
}

.active-goal-card__stat {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--color-app-bg, #f7f8f4);
}

.active-goal-card__stat-label {
  font-size: 11px;
  color: var(--color-text-tertiary, #8f968c);
}

.active-goal-card__stat-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary, #10130f);
  font-variant-numeric: tabular-nums;
}
</style>
