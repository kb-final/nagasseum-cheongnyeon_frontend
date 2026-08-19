<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import BaseDivider from '@/shared/components/atoms/base/divider/BaseDivider.vue'
import { toFundingViewModel } from '@/features/goal/utils/recommendationViewModel'

const props = defineProps({
  loanX: { type: Object, required: true },
  // 대출 활용 플랜이 없는 recommendation도 있을 수 있어 필수값이 아니다.
  loanO: { type: Object, default: null },
  // "대출 없이" 영역의 구성이 PREFERENCE_DATE_FIXED만 달라 필요하다.
  type: { type: String, default: null },
})

const view = computed(() =>
  toFundingViewModel({ type: props.type, loanX: props.loanX, loanO: props.loanO }),
)
</script>

<template>
  <BaseCard class="recommendation-funding-card">
    <p class="recommendation-funding-card__label">이 목표를 준비하려면</p>

    <section class="recommendation-funding-card__section">
      <h3 class="recommendation-funding-card__section-title">대출 없이</h3>

      <p class="recommendation-funding-card__row-label">{{ view.withoutLoan.primaryLabel }}</p>
      <p class="recommendation-funding-card__amount">{{ view.withoutLoan.primaryValueLabel }}</p>

      <div v-if="view.withoutLoan.rows.length > 0" class="recommendation-funding-card__stats">
        <div
          v-for="row in view.withoutLoan.rows"
          :key="row.label"
          class="recommendation-funding-card__stat"
        >
          <span class="recommendation-funding-card__row-label">{{ row.label }}</span>
          <strong class="recommendation-funding-card__stat-value">{{ row.value }}</strong>
        </div>
      </div>
    </section>

    <template v-if="view.withLoan">
      <BaseDivider class="recommendation-funding-card__divider" />

      <section class="recommendation-funding-card__section">
        <h3 class="recommendation-funding-card__section-title">대출을 활용하면</h3>

        <div class="recommendation-funding-card__stats">
          <div
            v-for="row in view.withLoan.firstRow"
            :key="row.label"
            class="recommendation-funding-card__stat"
          >
            <span class="recommendation-funding-card__row-label">{{ row.label }}</span>
            <strong class="recommendation-funding-card__stat-value">{{ row.value }}</strong>
          </div>
        </div>

        <div
          v-if="view.withLoan.secondRow.length > 0"
          class="recommendation-funding-card__stats recommendation-funding-card__stats--gap"
        >
          <div
            v-for="row in view.withLoan.secondRow"
            :key="row.label"
            class="recommendation-funding-card__stat"
          >
            <span class="recommendation-funding-card__row-label">{{ row.label }}</span>
            <strong class="recommendation-funding-card__stat-value">{{ row.value }}</strong>
          </div>
        </div>

        <p v-if="view.withLoan.highlight" class="recommendation-funding-card__highlight">
          {{ view.withLoan.highlight.prefix }}
          <strong class="recommendation-funding-card__highlight-emphasis">{{
            view.withLoan.highlight.emphasis
          }}</strong>
          {{ view.withLoan.highlight.suffix }}
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
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-secondary, #9aa09a);
}

.recommendation-funding-card__section {
  display: flex;
  flex-direction: column;
}

.recommendation-funding-card__section-title {
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
}

.recommendation-funding-card__row-label {
  /* "대출 없이" 영역에서는 이 라벨이 <p>라 브라우저 기본 문단 여백이 붙어, 같은 라벨이
     <span>으로 쓰이는 "대출을 활용하면" 영역보다 섹션 제목과 더 떨어져 보였다.
     margin을 0으로 고정해 두 영역의 간격을 section-title의 margin-bottom(12px)로 통일한다. */
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary, #9aa09a);
}

/* 상세 화면 전체 "핵심 값" 공통 크기(17px)에 weight만 700으로 맞춰, 이 카드 안에서도
   예상 도달 시점·월 저축(stat-value)과 같은 위계로 보이게 한다. */
.recommendation-funding-card__amount {
  margin: 4px 0 14px;
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
}

.recommendation-funding-card__stats {
  display: flex;
  gap: 12px;
}

.recommendation-funding-card__stats--gap {
  margin-top: 10px;
}

.recommendation-funding-card__stat {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 3px;
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
  margin: 17px 0;
  background: var(--color-border, #262626);
}

.recommendation-funding-card__highlight {
  margin: 14px 0 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--color-primary-soft, #e8f4ea);
  color: #353934;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
}

/* 강조 box 안에서도 핵심 숫자가 가장 먼저 읽혀야 해서, 그 부분만 한 단계 더 굵게 한다.
   새 색상/배경 없이 font-weight만으로 구분한다. */
.recommendation-funding-card__highlight-emphasis {
  font-weight: 800;
}

.recommendation-funding-card__note {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--color-text-secondary, #9aa09a);
}
</style>
