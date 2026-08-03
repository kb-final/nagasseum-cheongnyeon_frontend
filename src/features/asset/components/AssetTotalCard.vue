<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import { formatWon } from '@/shared/utils/formatter'

const props = defineProps({
  totalAssets: { type: Number, required: true },
  syncedAt: { type: String, default: null },
  isRefreshing: { type: Boolean, default: false },
})

defineEmits(['refresh'])

// 오늘이면 "오늘 HH:mm", 아니면 "MM.DD HH:mm"으로 표시
const syncedAtLabel = computed(() => {
  if (!props.syncedAt) return null

  const synced = new Date(props.syncedAt)
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
  <BaseCard class="asset-total-card">
    <div class="asset-total-card__top">
      <span class="asset-total-card__label">총 자산</span>
      <BaseButton
        variant="dark"
        class="asset-total-card__refresh-btn"
        :disabled="isRefreshing"
        @click="$emit('refresh')"
      >
        {{ isRefreshing ? '갱신 중…' : '↻ 갱신' }}
      </BaseButton>
    </div>
    <p class="asset-total-card__amount">{{ formatWon(totalAssets) }}</p>
    <span v-if="syncedAtLabel" class="asset-total-card__synced"
      >마지막 갱신 · {{ syncedAtLabel }}</span
    >
  </BaseCard>
</template>

<style scoped>
.asset-total-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--accent, #e3ffe8);
}

.asset-total-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.asset-total-card__label {
  font-size: 12px;
  color: #2f6b4f;
}

.asset-total-card__amount {
  margin: 0;
  font-size: 26px;
  color: #0b3b24;
}

.asset-total-card__synced {
  font-size: 11px;
  color: #55695f;
}

.asset-total-card :deep(.asset-total-card__refresh-btn) {
  width: auto;
  height: 30px;
  padding: 0 12px;
  border-radius: 15px;
  color: var(--accent, #e3ffe8);
  font-size: 12px;
  font-weight: 400;
}
</style>
