<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import { formatWon, formatRecordMonth } from '@/shared/utils/formatter'

const props = defineProps({
  // homeStore.currentSavingRecord 그대로 { recordYm, targetSaving, actualSaving, recorded, differenceAmount }
  record: { type: Object, required: true },
})

const emit = defineEmits(['open'])

const monthLabel = computed(() => formatRecordMonth(props.record.recordYm))

// actualSaving이 null인지가 아니라 recorded로만 입력 여부를 가른다(0원도 유효한 기록이라 null 체크로는 구분 불가).
const differenceLabel = computed(() => {
  const diff = props.record.differenceAmount
  if (diff > 0) return `계획보다 ${formatWon(diff)} 더 저축했어요`
  if (diff < 0) return `계획보다 ${formatWon(Math.abs(diff))} 적게 저축했어요`
  return '계획한 금액만큼 저축했어요'
})
</script>

<template>
  <BaseCard class="monthly-saving-card">
    <template v-if="!record.recorded">
      <p class="monthly-saving-card__question">{{ monthLabel }}에는 얼마를 저축했나요?</p>

      <div class="monthly-saving-card__row">
        <span class="monthly-saving-card__row-label">계획한 저축액</span>
        <strong class="monthly-saving-card__row-value">{{ formatWon(record.targetSaving) }}</strong>
      </div>

      <button type="button" class="monthly-saving-card__cta" @click="emit('open')">
        이번 달 저축액 입력하기 <span aria-hidden="true"></span>
      </button>
    </template>

    <template v-else>
      <div class="monthly-saving-card__top">
        <p class="monthly-saving-card__title">✓ {{ monthLabel }} 저축 기록</p>
        <button type="button" class="monthly-saving-card__edit" @click="emit('open')">수정</button>
      </div>

      <p class="monthly-saving-card__amount">{{ formatWon(record.actualSaving) }}</p>
      <p class="monthly-saving-card__diff">{{ differenceLabel }}</p>
    </template>
  </BaseCard>
</template>

<style scoped>
.monthly-saving-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: var(--sans-normal);
}

.monthly-saving-card__title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--home-text-primary, #10130f);
}

.monthly-saving-card__question {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-secondary, #9aa09a);
}

.monthly-saving-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--color-app-bg, #f7f8f4);
}

.monthly-saving-card__row-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-tertiary, #8f968c);
}

.monthly-saving-card__row-value {
  font-size: 15px;
  font-weight: 900;
  color: var(--home-text-primary, #10130f);
  font-variant-numeric: tabular-nums;
}

.monthly-saving-card__cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 44px;
  margin-top: 10px;
  border: none;
  border-radius: 12px;
  background: var(--color-primary, #1d6b3f);
  color: #ffffff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.monthly-saving-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.monthly-saving-card__edit {
  flex: none;
  padding: 4px;
  border: none;
  background: none;
  color: var(--color-text-tertiary, #8f968c);
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.monthly-saving-card__amount {
  margin: 6px 0 2px;
  font-size: 22px;
  font-weight: 900;
  color: var(--home-text-primary, #10130f);
  font-variant-numeric: tabular-nums;
}

.monthly-saving-card__diff {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary, #1d6b3f);
}
</style>
