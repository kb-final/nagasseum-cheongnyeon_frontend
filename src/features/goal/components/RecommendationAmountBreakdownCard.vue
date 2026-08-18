<script setup>
import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import BaseDivider from '@/shared/components/atoms/base/divider/BaseDivider.vue'

defineProps({
  // toAmountBreakdownViewModel()의 결과. 호출부가 이미 null 여부로 카드 표시 자체를 판단하므로
  // 이 컴포넌트는 항상 값이 있다고 가정한다.
  view: { type: Object, required: true },
})
</script>

<template>
  <BaseCard class="recommendation-amount-breakdown-card">
    <p class="recommendation-amount-breakdown-card__label">준비 금액은 이렇게 계산했어요</p>

    <div class="recommendation-amount-breakdown-card__row">
      <span class="recommendation-amount-breakdown-card__row-label">실거래 중앙값</span>
      <span class="recommendation-amount-breakdown-card__row-value">{{
        view.marketMedianAmountLabel
      }}</span>
    </div>
    <div class="recommendation-amount-breakdown-card__row">
      <span class="recommendation-amount-breakdown-card__row-label">현재 활용 가능 자금</span>
      <span class="recommendation-amount-breakdown-card__row-value">{{
        view.currentAvailableAmountLabel
      }}</span>
    </div>

    <BaseDivider class="recommendation-amount-breakdown-card__divider" />

    <div
      class="recommendation-amount-breakdown-card__row recommendation-amount-breakdown-card__row--total"
    >
      <span class="recommendation-amount-breakdown-card__row-label">추가 준비 금액</span>
      <strong class="recommendation-amount-breakdown-card__total-value">{{
        view.additionalAmountLabel
      }}</strong>
    </div>

    <p class="recommendation-amount-breakdown-card__note">
      현재 활용 가능 자금을 반영해 계산했어요.
    </p>
  </BaseCard>
</template>

<style scoped>
.recommendation-amount-breakdown-card {
  display: flex;
  flex-direction: column;
}

.recommendation-amount-breakdown-card__label {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-secondary, #9aa09a);
}

.recommendation-amount-breakdown-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 3px 0;
}

.recommendation-amount-breakdown-card__row-label {
  font-size: 13px;
  color: var(--color-text-secondary, #9aa09a);
}

.recommendation-amount-breakdown-card__row-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary, #ffffff);
}

/* BaseDivider 기본값은 테마를 안 타는 legacy 변수(--border)라 라이트 모드에서 너무 짙게
   보인다. 마이페이지(.my-page-view__row)와 같은 테마별 톤(--color-border)으로 맞춘다. */
.recommendation-amount-breakdown-card__divider {
  margin: 7px 0;
  background: var(--color-border, #262626);
}

.recommendation-amount-breakdown-card__row--total {
  padding: 3px 0 0;
}

.recommendation-amount-breakdown-card__total-value {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text-primary, #ffffff);
}

.recommendation-amount-breakdown-card__note {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--color-text-secondary, #9aa09a);
}
</style>
