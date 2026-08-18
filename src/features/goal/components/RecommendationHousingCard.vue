<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import BaseDivider from '@/shared/components/atoms/base/divider/BaseDivider.vue'
import { toHousingViewModel } from '@/features/goal/utils/recommendationViewModel'

const props = defineProps({
  condition: { type: Object, required: true },
})

const view = computed(() => toHousingViewModel(props.condition))
</script>

<template>
  <BaseCard class="recommendation-housing-card">
    <p class="recommendation-housing-card__label">주거 조건</p>

    <p class="recommendation-housing-card__region">{{ view.regionName }}</p>
    <p class="recommendation-housing-card__type">{{ view.typeLine }}</p>
    <p class="recommendation-housing-card__area">{{ view.areaLine }}</p>

    <template v-if="view.sampleCountLabel">
      <BaseDivider class="recommendation-housing-card__divider" />
      <p class="recommendation-housing-card__sample">{{ view.sampleCountLabel }}</p>
    </template>
  </BaseCard>
</template>

<style scoped>
.recommendation-housing-card {
  display: flex;
  flex-direction: column;
}

.recommendation-housing-card__label {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-secondary, #9aa09a);
}

.recommendation-housing-card__region {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 800;
  color: var(--color-text-primary, #ffffff);
}

.recommendation-housing-card__type {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary, #ffffff);
}

.recommendation-housing-card__area {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-secondary, #9aa09a);
}

/* BaseDivider 기본값은 테마를 안 타는 legacy 변수(--border)라 라이트 모드에서 너무 짙게
   보인다. 마이페이지(.my-page-view__row)와 같은 테마별 톤(--color-border)으로 맞춘다. */
.recommendation-housing-card__divider {
  margin: 16px 0 12px;
  background: var(--color-border, #262626);
}

.recommendation-housing-card__sample {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary, #9aa09a);
}
</style>
