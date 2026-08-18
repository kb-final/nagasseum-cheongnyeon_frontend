<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import BaseDivider from '@/shared/components/atoms/base/divider/BaseDivider.vue'
import { toFundingViewModel } from '@/features/goal/utils/recommendationViewModel'

const props = defineProps({
  loanX: { type: Object, required: true },
  // 대출 활용 플랜이 없는 recommendation도 있을 수 있어 필수값이 아니다.
  loanO: { type: Object, default: null },
})

const view = computed(() => toFundingViewModel({ loanX: props.loanX, loanO: props.loanO }))
</script>

<template>
  <BaseCard class="recommendation-funding-card">
    <p class="recommendation-funding-card__label">이 목표를 준비하려면</p>

    <section class="recommendation-funding-card__section">
      <h3 class="recommendation-funding-card__section-title">대출 없이</h3>

      <p class="recommendation-funding-card__row-label">추가 준비 금액</p>
      <p class="recommendation-funding-card__amount">{{ view.withoutLoan.targetAmountLabel }}</p>

      <div class="recommendation-funding-card__stats">
        <div class="recommendation-funding-card__stat">
          <span class="recommendation-funding-card__row-label">예상 목표</span>
          <strong class="recommendation-funding-card__stat-value">{{
            view.withoutLoan.targetDateLabel
          }}</strong>
        </div>
        <div class="recommendation-funding-card__stat">
          <span class="recommendation-funding-card__row-label">월 저축</span>
          <strong class="recommendation-funding-card__stat-value">{{
            view.withoutLoan.monthlySavingLabel
          }}</strong>
        </div>
      </div>
    </section>

    <template v-if="view.withLoan">
      <BaseDivider class="recommendation-funding-card__divider" />

      <section class="recommendation-funding-card__section">
        <h3 class="recommendation-funding-card__section-title">대출을 활용하면</h3>

        <div class="recommendation-funding-card__stats">
          <div class="recommendation-funding-card__stat">
            <span class="recommendation-funding-card__row-label">예상 대출 금액</span>
            <strong class="recommendation-funding-card__stat-value">{{
              view.withLoan.loanAmountLabel
            }}</strong>
          </div>
          <div class="recommendation-funding-card__stat">
            <span class="recommendation-funding-card__row-label">직접 준비할 금액</span>
            <strong class="recommendation-funding-card__stat-value">{{
              view.withLoan.targetAmountLabel
            }}</strong>
          </div>
        </div>

        <div class="recommendation-funding-card__stats recommendation-funding-card__stats--gap">
          <div class="recommendation-funding-card__stat">
            <span class="recommendation-funding-card__row-label">예상 목표</span>
            <strong class="recommendation-funding-card__stat-value">{{
              view.withLoan.targetDateLabel
            }}</strong>
          </div>
          <div class="recommendation-funding-card__stat">
            <span class="recommendation-funding-card__row-label">월 저축</span>
            <strong class="recommendation-funding-card__stat-value">{{
              view.withLoan.monthlySavingLabel
            }}</strong>
          </div>
        </div>

        <p v-if="view.withLoan.shortenedLabel" class="recommendation-funding-card__highlight">
          대출을 활용하면 예상 도달 시점이 {{ view.withLoan.shortenedLabel }} 빨라져요
        </p>

        <p class="recommendation-funding-card__note">
          실제 대출 가능 금액은 금융기관 심사 결과에 따라 달라질 수 있어요.
        </p>
      </section>
    </template>
  </BaseCard>
</template>

<style scoped>
.recommendation-funding-card {
  display: flex;
  flex-direction: column;
}

.recommendation-funding-card__label {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-secondary, #9aa09a);
}

.recommendation-funding-card__section {
  display: flex;
  flex-direction: column;
}

.recommendation-funding-card__section-title {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
}

.recommendation-funding-card__row-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary, #9aa09a);
}

.recommendation-funding-card__amount {
  margin: 4px 0 16px;
  font-size: 24px;
  font-weight: 800;
  color: var(--color-text-primary, #ffffff);
}

.recommendation-funding-card__stats {
  display: flex;
  gap: 12px;
}

.recommendation-funding-card__stats--gap {
  margin-top: 12px;
}

.recommendation-funding-card__stat {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.recommendation-funding-card__stat-value {
  margin-top: 2px;
  overflow: hidden;
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* BaseDivider 기본값은 테마를 안 타는 legacy 변수(--border)라 라이트 모드에서 너무 짙게
   보인다. 마이페이지(.my-page-view__row)와 같은 테마별 톤(--color-border)으로 맞춘다. */
.recommendation-funding-card__divider {
  margin: 20px 0;
  background: var(--color-border, #262626);
}

.recommendation-funding-card__highlight {
  margin: 16px 0 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--color-primary-soft, #e8f4ea);
  color: #353934;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
}

.recommendation-funding-card__note {
  margin: 12px 0 0;
  font-size: 12px;
  color: var(--color-text-secondary, #9aa09a);
}
</style>
