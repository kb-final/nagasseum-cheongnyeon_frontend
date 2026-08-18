<script setup>
import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'

defineProps({
  title: { type: String, required: true },
  // 있으면 rows/timeline 위에 안내 문장으로 보여준다 (예: PREFERENCE의 "이 계획은 이렇게 구성했어요")
  description: { type: String, default: null },
  // description 문장 뒤에 이어 붙이되 그 부분만 굵게 강조한다 (예: HOLD_OUT의 "5년 6개월 더 필요해요")
  descriptionEmphasis: { type: String, default: null },
  // [{ label, value, emphasis }] — 예: REALISTIC의 "목표 시점 / 목표 시점까지 준비 가능한 금액".
  // emphasis:true인 row는 이 recommendation이 만들어진 직접적인 근거값이라는 뜻으로 value를
  // 한 단계 더 굵게 보여준다.
  rows: { type: Array, default: () => [] },
  // HOLD_OUT처럼 "기준 목표 시점 -> 예상 도달 시점"을 화살표로 이어 보여줘야 할 때만 채운다
  timeline: {
    type: Object,
    default: null,
    // { fromLabel, fromValue, toLabel, toValue }
  },
})
</script>

<template>
  <BaseCard class="recommendation-basis-card">
    <p class="recommendation-basis-card__label">{{ title }}</p>

    <div v-if="timeline" class="recommendation-basis-card__compare">
      <div class="recommendation-basis-card__compare-box">
        <span class="recommendation-basis-card__row-label">{{ timeline.fromLabel }}</span>
        <strong class="recommendation-basis-card__row-value">{{ timeline.fromValue }}</strong>
      </div>
      <span class="recommendation-basis-card__compare-arrow">→</span>
      <div class="recommendation-basis-card__compare-box">
        <span class="recommendation-basis-card__row-label">{{ timeline.toLabel }}</span>
        <strong class="recommendation-basis-card__row-value">{{ timeline.toValue }}</strong>
      </div>
    </div>

    <div v-for="row in rows" :key="row.label" class="recommendation-basis-card__row">
      <span class="recommendation-basis-card__row-label">{{ row.label }}</span>
      <span
        class="recommendation-basis-card__row-value"
        :class="{ 'recommendation-basis-card__row-value--emphasis': row.emphasis }"
        >{{ row.value }}</span
      >
    </div>

    <p v-if="description" class="recommendation-basis-card__description">
      {{ description }}
      <strong v-if="descriptionEmphasis" class="recommendation-basis-card__description-emphasis">{{
        descriptionEmphasis
      }}</strong>
    </p>
  </BaseCard>
</template>

<style scoped>
.recommendation-basis-card {
  display: flex;
  flex-direction: column;
}

.recommendation-basis-card__label {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-secondary, #9aa09a);
}

/*
  목표 상세 화면의 매물 시세 변화 카드(MarketPriceAlertCard의 "유지 시 → 반영 시" 비교 패널)와
  같은 구조를 재사용한다 — 배경 박스 안에 두 값을 나란히 두고 화살표로 잇는다. 다만 거기서는
  "반영 시" 값을 --color-primary(초록)로 강조하는데, HOLD_OUT의 "예상 도달 시점"은 목표가
  늦어진 결과라 긍정적 강조가 아니므로 두 값 모두 같은 primary-text 톤으로 둔다(row-value 재사용).
*/
.recommendation-basis-card__compare {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: var(--color-app-bg, #111111);
  border-radius: 10px;
}

.recommendation-basis-card__compare-box {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.recommendation-basis-card__compare-arrow {
  flex-shrink: 0;
  font-size: 13px;
  color: var(--color-text-secondary, #9aa09a);
}

.recommendation-basis-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
}

/* ":not(:last-child)"는 BaseCard의 진짜 마지막 자식 기준이라, row 뒤에 divider·설명 문구가
   더 있으면 마지막 row도 "마지막 자식이 아님"으로 걸려 자체 border-bottom이 그려지고 바로 아래
   BaseDivider와 겹쳐 선이 두 줄로 보였다. row끼리의 인접 형제로만 판단해 row 사이 경계에만
   선이 그어지게 한다(마지막 row 뒤에 무엇이 오든 영향받지 않음). */
.recommendation-basis-card__row + .recommendation-basis-card__row {
  border-top: 1px solid var(--color-border, #262626);
}

/* 상세 화면 전체 row-label/핵심 값 공통 톤(12px·600 / 17px·700) —
   RecommendationHousingCard/AmountBreakdownCard/FundingCard와 동일. */
.recommendation-basis-card__row-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary, #9aa09a);
}

.recommendation-basis-card__row-value {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
}

/* 이 recommendation이 만들어진 직접적인 근거값(예: REALISTIC의 "목표 시점까지 준비 가능한
   금액")이라는 걸 나타내기 위해 다른 row보다 한 단계 더 굵게 한다. 색상/크기는 그대로 둔다. */
.recommendation-basis-card__row-value--emphasis {
  font-weight: 800;
}

/* 상세 화면의 다른 캡션(RecommendationAmountBreakdownCard__note,
   RecommendationFundingCard__note)과 같은 톤(12px)으로 맞춘다. */
.recommendation-basis-card__description {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--color-text-secondary, #9aa09a);
}

/* HOLD_OUT의 "N년 M개월 더 필요해요"처럼, 문장 안에서 가장 먼저 읽혀야 하는 핵심 결과만
   font-weight로 강조한다. 별도 색상이나 크기 변화는 주지 않는다. */
.recommendation-basis-card__description-emphasis {
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
}
</style>
