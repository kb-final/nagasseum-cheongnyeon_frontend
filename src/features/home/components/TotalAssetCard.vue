<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import { formatWon } from '@/shared/utils/formatter'

const props = defineProps({
  assetSummary: { type: Object, required: true },
})

defineEmits(['refresh'])

// 오늘이면 "오늘 HH:mm", 아니면 "MM.DD HH:mm"으로 표시
const syncedAtLabel = computed(() => {
  const synced = new Date(props.assetSummary.syncedAt)
  const now = new Date()
  const time = synced.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const isToday = synced.toDateString() === now.toDateString()
  if (isToday) return `오늘 ${time}`
  return `${synced.getMonth() + 1}.${synced.getDate()} ${time}`
})
</script>

<template>
  <BaseCard class="total-asset-card">
    <div class="total-asset-card__top">
      <span class="total-asset-card__label">총 자산</span>
    </div>
    <p class="total-asset-card__amount">{{ formatWon(assetSummary.totalAssets) }}</p>
    <div class="total-asset-card__footer">
      <span class="total-asset-card__synced">마지막 갱신 · {{ syncedAtLabel }}</span>
      <BaseButton
        variant="secondary"
        class="total-asset-card__refresh-btn"
        @click="$emit('refresh')"
      >
        갱신
      </BaseButton>
    </div>
  </BaseCard>
</template>

<style scoped>
.total-asset-card {
  display: flex;
  flex-direction: column;
  background: var(--color-card-highlight, #f7ffd1);
}

.total-asset-card__label {
  font-size: 13px;
  color: var(--color-mint-deep, #16281c);
}

.total-asset-card__amount {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-mint-deep, #16281c);
}

.total-asset-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.total-asset-card__synced {
  font-size: 12px;
  color: var(--color-mint-deep, #16281c);
  opacity: 0.7;
}

.total-asset-card :deep(.total-asset-card__refresh-btn) {
  width: auto;
  height: 32px;
  padding: 0 14px;
  border-radius: 16px;
  background: var(--color-mint-deep, #16281c);
  color: var(--color-card-highlight, #f7ffd1);
  font-size: 13px;
  font-weight: 400;
}
</style>
