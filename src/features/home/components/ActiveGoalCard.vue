<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import { formatEokManwon } from '@/shared/utils/formatter'

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
      <p class="active-goal-card__title">{{ goalTitle }}</p>
      <RouterLink class="active-goal-card__detail" :to="`/goals/${goal.id}`">자세히 ›</RouterLink>
    </div>

    <p class="active-goal-card__subtitle">
      <span class="active-goal-card__subtitle-label">목표 금액 </span>
      <span class="active-goal-card__subtitle-value">{{ formatEokManwon(goal.targetAmount) }}</span>
    </p>

    <div class="active-goal-card__stats">
      <div class="active-goal-card__stat">
        <span class="active-goal-card__stat-label">현재</span>
        <strong class="active-goal-card__stat-value">{{
          formatEokManwon(climb.currentAmount)
        }}</strong>
      </div>
      <div class="active-goal-card__stat">
        <span class="active-goal-card__stat-label">남은 금액</span>
        <strong class="active-goal-card__stat-value">{{
          formatEokManwon(climb.remainingAmount)
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
  font-family: var(--sans-normal);
}

/* 제목과 '자세히'의 윗면을 같은 선에 맞춘다. 글자 크기 차가 커서 baseline/center로
   맞추면 '자세히' 쪽이 아래로 처져 보인다. */
.active-goal-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.active-goal-card__detail {
  flex: none;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-tertiary, #8f968c);
  text-decoration: none;
}

/* 이 카드에서 가장 먼저 읽혀야 하는 목표 제목이라 카드 안에서 제일 크게 둔다. */
.active-goal-card__title {
  overflow: hidden;
  margin: 0;
  font-size: 20px;
  font-weight: 900;
  color: var(--home-text-primary, #10130f);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.active-goal-card__subtitle {
  margin: 0 0 4px;
  font-size: 12px;
}

.active-goal-card__subtitle-label {
  font-weight: 700;
  color: var(--total-asset-label, #12281c);
}

/* 라벨과 구분되게 한 칸 띄우고, 목표 금액이라는 걸 색으로도 강조한다. */
.active-goal-card__subtitle-value {
  margin-left: 4px;
  font-size: 15px;
  font-weight: 900;
  color: var(--color-primary, #1d6b3f);
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
  font-weight: 700;
  color: var(--color-text-tertiary, #8f968c);
}

.active-goal-card__stat-value {
  font-size: 15px;
  font-weight: 900;
  color: var(--home-text-primary, #10130f);
  font-variant-numeric: tabular-nums;
}
</style>
