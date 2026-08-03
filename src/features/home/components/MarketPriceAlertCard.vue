<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import BaseBadge from '@/shared/components/atoms/base/badge/BaseBadge.vue'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import { formatEok } from '@/shared/utils/formatter'

const props = defineProps({
  marketAlert: { type: Object, required: true },
})

defineEmits(['edit-goal'])

// "3,000만원" 형태로 표기 (이 카드에서만 쓰는 만원 단위 표기라 지역 헬퍼로 둠)
function formatManwon(amount) {
  return `${Math.round(amount / 10000).toLocaleString('ko-KR')}만원`
}

const subtitle = computed(() => {
  const [year, month] = props.marketAlert.updatedYm.split('-')
  const a = props.marketAlert
  return `${a.regionName} · ${a.housingType} · ${a.dealType} · ${a.areaLabel} · ${year}년 ${Number(month)}월 갱신`
})

// 점 3개의 최소/최대 금액을 기준으로 가로 위치(%)를 계산한다.
// 값이 바뀌면(최소/최대가 바뀌면) 위치도 자동으로 다시 계산됨. 8~92% 범위에 배치해 점이 카드 가장자리에 붙지 않게 함.
// 금액이 같은 점들은 dot·라벨을 하나로 합치고(원래 순서대로 라벨을 이어붙임), 병합된 dot은 mint-deep 고정색으로 표시한다.
const timeline = computed(() => {
  const a = props.marketAlert
  const points = [
    { label: '내 목표', amount: a.targetAmount, variant: 'mint' },
    { label: '설정 당시', amount: a.initialMiddleAmount, variant: 'neutral' },
    { label: '현재 중앙값', amount: a.currentMiddleAmount, variant: 'point' },
  ]
  const amounts = points.map((point) => point.amount)
  const min = Math.min(...amounts)
  const max = Math.max(...amounts)
  const range = max - min

  const grouped = []
  for (const point of points) {
    const existing = grouped.find((group) => group.amount === point.amount)
    if (existing) {
      existing.labels.push(point.label)
    } else {
      grouped.push({ amount: point.amount, labels: [point.label], variant: point.variant })
    }
  }

  return grouped.map((group) => ({
    label: group.labels.join(' · '),
    amount: group.amount,
    variant: group.labels.length > 1 ? 'merged' : group.variant,
    percent: range === 0 ? 50 : 8 + ((group.amount - min) / range) * 84,
  }))
})

// "2028-09" -> "2028.09"
function formatEta(ym) {
  return ym.replace('-', '.')
}

// 내 목표가 중앙값보다 낮은지/높은지에 따라 방향 표현과 금액 강조색을 바꾼다(주어는 항상 "내 목표가 중앙값보다")
// 목표 > 중앙값(높아요): #C1442E, 목표 < 중앙값(낮아요): #57B5B7
const diffDirection = computed(() => {
  const { targetAmount, currentMiddleAmount } = props.marketAlert
  if (targetAmount === currentMiddleAmount) return 'same'
  return targetAmount < currentMiddleAmount ? 'low' : 'high'
})

const diffAmountText = computed(() => {
  const { targetAmount, currentMiddleAmount } = props.marketAlert
  return formatManwon(Math.abs(currentMiddleAmount - targetAmount))
})
</script>

<template>
  <BaseCard class="market-alert">
    <div class="market-alert__header">
      <h2 class="market-alert__title">매물 시세 변화</h2>
      <BaseBadge variant="point">▲ +{{ formatManwon(marketAlert.changeAmount) }}</BaseBadge>
    </div>
    <p class="market-alert__subtitle">{{ subtitle }}</p>

    <div class="market-alert__timeline">
      <div
        v-for="point in timeline"
        :key="point.label"
        class="market-alert__point"
        :style="{ left: `${point.percent}%` }"
      >
        <span class="market-alert__dot" :class="`market-alert__dot--${point.variant}`" />
        <span class="market-alert__point-label">{{ point.label }}</span>
        <span class="market-alert__point-amount">{{ formatEok(point.amount) }}</span>
      </div>
    </div>

    <p class="market-alert__diff">
      <template v-if="diffDirection === 'same'">내 목표가 중앙값과 같아요.</template>
      <template v-else
        >내 목표가 중앙값보다
        <span
          class="market-alert__diff-amount"
          :class="`market-alert__diff-amount--${diffDirection}`"
          >{{ diffAmountText }}</span
        >
        {{ diffDirection === 'low' ? '낮아요' : '높아요' }}.</template
      >
    </p>

    <div class="market-alert__compare">
      <div class="market-alert__compare-box">
        <span class="market-alert__compare-label">유지 시</span>
        <span class="market-alert__compare-value">{{ formatEok(marketAlert.targetAmount) }}</span>
        <span class="market-alert__compare-eta">{{ formatEta(marketAlert.maintainEta) }}</span>
      </div>
      <span class="market-alert__compare-arrow">→</span>
      <div class="market-alert__compare-box">
        <span class="market-alert__compare-label">반영 시</span>
        <span class="market-alert__compare-value">{{
          formatEok(marketAlert.currentMiddleAmount)
        }}</span>
        <span class="market-alert__compare-eta">{{ formatEta(marketAlert.reflectEta) }}</span>
      </div>
    </div>

    <p class="market-alert__hint">
      현재 시세에 맞게 목표를 변경하시려면<br />목표 수정하기를 눌러주세요
    </p>

    <BaseButton variant="dark" size="lg" @click="$emit('edit-goal')">목표 수정하기</BaseButton>
  </BaseCard>
</template>

<style scoped>
.market-alert {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--color-card-highlight, #f7ffd1);
}

.market-alert__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.market-alert__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-mint-deep, #16281c);
}

.market-alert__subtitle {
  font-size: 12px;
  color: var(--color-mint-deep, #16281c);
  opacity: 0.7;
}

.market-alert__timeline {
  position: relative;
  height: 64px;
  padding-top: 6px;
}

.market-alert__timeline::before {
  content: '';
  position: absolute;
  top: 10.5px;
  right: 0;
  left: 0;
  height: 3px;
  background: rgba(22, 40, 28, 0.2);
}

.market-alert__point {
  position: absolute;
  top: 6px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transform: translateX(-50%);
  white-space: nowrap;
}

.market-alert__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-card-highlight, #f7ffd1);
  border: 2px solid rgba(22, 40, 28, 0.3);
}

.market-alert__dot--mint {
  background: var(--color-mint-strong, #c1e8c8);
  border-color: var(--color-mint-strong, #c1e8c8);
}

.market-alert__dot--neutral {
  background: #8fa079;
  border-color: #8fa079;
}

.market-alert__dot--point {
  background: var(--color-point, #c1442e);
  border-color: var(--color-point, #c1442e);
}

.market-alert__dot--merged {
  background: var(--color-mint-deep, #16281c);
  border-color: var(--color-mint-deep, #16281c);
}

.market-alert__point-label {
  font-size: 11px;
  color: var(--color-mint-deep, #16281c);
  opacity: 0.7;
}

.market-alert__point-amount {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-mint-deep, #16281c);
}

.market-alert__diff {
  font-size: 13px;
  color: var(--color-mint-deep, #16281c);
}

.market-alert__diff-amount {
  font-weight: 700;
}

.market-alert__diff-amount--high {
  color: #c1442e;
}

.market-alert__diff-amount--low {
  color: #57b5b7;
}

.market-alert__compare {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: var(--color-card-sub, #effab8);
  border-radius: 10px;
}

.market-alert__compare-arrow {
  flex-shrink: 0;
  color: var(--color-mint-deep, #16281c);
  opacity: 0.7;
  font-size: 13px;
}

.market-alert__compare-box {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.market-alert__compare-label {
  font-size: 11px;
  color: var(--color-mint-deep, #16281c);
  opacity: 0.7;
}

.market-alert__compare-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-mint-deep, #16281c);
}

.market-alert__compare-eta {
  font-size: 11px;
  color: var(--color-mint-deep, #16281c);
  opacity: 0.7;
}

.market-alert__hint {
  font-size: 12px;
  color: var(--color-mint-deep, #16281c);
  opacity: 0.7;
  text-align: center;
}
</style>
