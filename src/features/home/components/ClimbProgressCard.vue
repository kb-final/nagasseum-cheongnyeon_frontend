<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import { formatWon, formatEok } from '@/shared/utils/formatter'

const props = defineProps({
  climb: { type: Object, required: true },
  goal: { type: Object, required: true },
})

defineEmits(['view-goal'])

const goalTitle = computed(
  () =>
    `${props.goal.regionName} ${props.goal.housingType} ${props.goal.dealType} ${formatEok(props.goal.targetAmount)}`,
)

// "2028-03-31" -> "2028.03"
const targetEta = computed(() => props.goal.targetDate.slice(0, 7).replace('-', '.'))

const filledSegments = computed(() => Math.round(props.climb.progressPercent / 10))
</script>

<template>
  <div class="climb-progress-card">
    <!-- TODO: 실제 등반 일러스트 자산(src/assets/images/mountain-*.svg|png)이 준비되면 아래 SVG placeholder를 교체 -->
    <div class="climb-card__illustration">
      <div class="climb-card__illustration-inner">
        <svg viewBox="0 0 300 160" class="climb-card__mountain" preserveAspectRatio="none">
          <polygon
            points="0,160 90,40 150,100 220,20 300,160"
            fill="var(--color-mint-deep, #16281c)"
          />
          <polygon
            points="60,160 150,60 240,160"
            fill="var(--color-mint-strong, #c1e8c8)"
            opacity="0.25"
          />
        </svg>
        <div class="climb-card__peak">
          <span class="climb-card__peak-icon">🏠</span>
          <span class="climb-card__peak-label">내 집</span>
        </div>
        <div
          class="climb-card__marker"
          :style="{ left: `${climb.progressPercent}%`, bottom: `${climb.progressPercent * 0.6}%` }"
        >
          <span class="climb-card__marker-icon">🧗</span>
          <span class="climb-card__marker-label">나 {{ climb.progressPercent }}%</span>
        </div>
      </div>
    </div>

    <BaseCard class="climb-card__body">
      <div class="climb-card__status">
        <span>정상까지 {{ 100 - climb.progressPercent }}% 남음</span>
        <span class="climb-card__increase">+{{ formatWon(climb.recentIncreaseAmount) }}</span>
      </div>

      <button type="button" class="climb-card__goal-summary" @click="$emit('view-goal')">
        <div class="climb-card__goal-summary-top">
          <span class="climb-card__goal-title">▲ {{ goalTitle }}</span>
          <span class="climb-card__goal-detail-link">자세히 ▷</span>
        </div>
        <p class="climb-card__goal-remaining">
          정상까지 {{ formatWon(climb.remainingAmount) }} · ETA {{ targetEta }}
        </p>
        <div class="climb-card__segments">
          <span
            v-for="n in 10"
            :key="n"
            class="climb-card__segment"
            :class="{ 'climb-card__segment--filled': n <= filledSegments }"
          />
        </div>
        <span class="climb-card__percent">{{ climb.progressPercent }}%</span>
      </button>
    </BaseCard>
  </div>
</template>

<style scoped>
.climb-progress-card {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.climb-card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--color-mint-pale, #cdedd3);
  border-radius: 0 0 16px 16px;
}

.climb-card__illustration {
  position: relative;
  height: 220px;
  padding: 3px;
  background: var(--color-mint-pale, #cdedd3);
  clip-path: polygon(50% 0%, 100% 26%, 100% 100%, 0% 100%, 0% 26%);
}

.climb-card__illustration-inner {
  position: relative;
  overflow: hidden;
  height: 100%;
  background: var(--bg, #111111);
  clip-path: polygon(50% 0%, 100% 26%, 100% 100%, 0% 100%, 0% 26%);
}

.climb-card__mountain {
  width: 100%;
  height: 100%;
}

.climb-card__peak {
  position: absolute;
  top: 8px;
  left: 47%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
}

.climb-card__peak-icon {
  font-size: 18px;
}

.climb-card__peak-label {
  padding: 1px 6px;
  border-radius: 6px;
  background: var(--color-mint-strong, #c1e8c8);
  color: var(--color-mint-deep, #16281c);
  font-size: 11px;
}

.climb-card__marker {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, 50%);
}

.climb-card__marker-icon {
  font-size: 16px;
}

.climb-card__marker-label {
  padding: 1px 6px;
  border-radius: 6px;
  background: var(--color-card-highlight, #f7ffd1);
  color: var(--color-mint-deep, #16281c);
  font-size: 11px;
  white-space: nowrap;
}

.climb-card__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--color-mint-deep, #16281c);
}

.climb-card__increase {
  color: var(--color-mint-deep, #16281c);
  font-weight: 700;
}

.climb-card__goal-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.climb-card__goal-summary-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-mint-deep, #16281c);
}

.climb-card__goal-detail-link {
  font-size: 12px;
  font-weight: 400;
  color: var(--color-mint-deep, #16281c);
  opacity: 0.7;
}

.climb-card__goal-remaining {
  font-size: 12px;
  color: var(--color-mint-deep, #16281c);
  opacity: 0.7;
}

.climb-card__segments {
  display: flex;
  gap: 4px;
}

.climb-card__segment {
  flex: 1;
  height: 13px;
  border-radius: 4px;
  background: rgba(22, 40, 28, 0.15);
}

.climb-card__segment--filled {
  background: var(--color-progress-fill, #1d6b3f);
}

.climb-card__percent {
  align-self: flex-end;
  font-size: 11px;
  color: var(--color-mint-deep, #16281c);
  opacity: 0.7;
}
</style>
