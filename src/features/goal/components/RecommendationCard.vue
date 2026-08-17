<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import BaseDivider from '@/shared/components/atoms/base/divider/BaseDivider.vue'
import BaseChevronIcon from '@/shared/components/atoms/base/icon/BaseChevronIcon.vue'
import { toRecommendationViewModel } from '@/features/goal/utils/recommendationViewModel'

const props = defineProps({
  recommendation: { type: Object, required: true },
})

const emit = defineEmits(['select'])

const view = computed(() => toRecommendationViewModel(props.recommendation))

function handleSelect() {
  emit('select', props.recommendation)
}
</script>

<template>
  <BaseCard
    class="recommendation-card"
    role="button"
    tabindex="0"
    @click="handleSelect"
    @keydown.enter="handleSelect"
    @keydown.space.prevent="handleSelect"
  >
    <p class="recommendation-card__title">{{ view.title }}</p>
    <p class="recommendation-card__strategy">{{ view.strategy }}</p>

    <BaseDivider class="recommendation-card__divider" />

    <p class="recommendation-card__condition-title">{{ view.conditionTitle }}</p>
    <p class="recommendation-card__condition-area">{{ view.conditionArea }}</p>

    <div class="recommendation-card__stats">
      <div class="recommendation-card__stat">
        <span class="recommendation-card__stat-label">모아야 할 금액</span>
        <strong class="recommendation-card__stat-value">{{ view.targetAmountLabel }}</strong>
      </div>
      <div class="recommendation-card__stat">
        <span class="recommendation-card__stat-label">{{ view.targetDateFieldLabel }}</span>
        <strong class="recommendation-card__stat-value">{{ view.targetDateLabel }}</strong>
      </div>
    </div>

    <span class="recommendation-card__more">
      자세히 보기
      <BaseChevronIcon :size="10" />
    </span>
  </BaseCard>
</template>

<style scoped>
.recommendation-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
}

.recommendation-card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text-primary, #ffffff);
}

.recommendation-card__strategy {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary, #1d6b3f);
}

/* BaseDivider 기본값은 테마를 안 타는 legacy 변수(--border)라 라이트 모드에서 너무 짙게
   보인다. 마이페이지(.my-page-view__row)와 같은 테마별 톤(--color-border)으로 맞춘다. */
.recommendation-card__divider {
  margin: 4px 0 12px;
  background: var(--color-border, #262626);
}

.recommendation-card__condition-title {
  margin: 0 0 4px;
  overflow: hidden;
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recommendation-card__condition-area {
  margin: 0 0 16px;
  font-size: 13px;
  color: var(--color-text-secondary, #9aa09a);
}

.recommendation-card__stats {
  display: flex;
  gap: 12px;
}

.recommendation-card__stat {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.recommendation-card__stat-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary, #9aa09a);
}

.recommendation-card__stat-value {
  overflow: hidden;
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recommendation-card__more {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  margin-top: 12px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary, #1d6b3f);
}
</style>
