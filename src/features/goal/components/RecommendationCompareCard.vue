<script setup>
import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'

defineProps({
  title: { type: String, required: true },
  // [{ fromLabel, fromValue, toLabel, toValue }] — 예: PREFERENCE_SAVING_FIXED의
  // "월 저축 → 예상 도달 시점", HOLD_OUT의 "면적/실거래 중앙값이 REALISTIC 대비 어떻게
  // 달라지는지" 등. 호출부(toCompareCardViewModel)가 이미 표시 가능 여부를 판단하므로
  // 이 컴포넌트는 항상 값이 있다고 가정한다.
  rows: { type: Array, required: true },
})
</script>

<template>
  <BaseCard class="recommendation-compare-card">
    <p class="recommendation-compare-card__label">{{ title }}</p>

    <div
      v-for="(row, index) in rows"
      :key="row.fromLabel + index"
      class="recommendation-compare-card__compare"
    >
      <div class="recommendation-compare-card__compare-box">
        <span class="recommendation-compare-card__row-label">{{ row.fromLabel }}</span>
        <strong class="recommendation-compare-card__row-value">{{ row.fromValue }}</strong>
      </div>
      <span class="recommendation-compare-card__compare-arrow">→</span>
      <div class="recommendation-compare-card__compare-box">
        <span class="recommendation-compare-card__row-label">{{ row.toLabel }}</span>
        <strong
          class="recommendation-compare-card__row-value recommendation-compare-card__row-value--emphasis"
          >{{ row.toValue }}</strong
        >
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
.recommendation-compare-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recommendation-compare-card__label {
  margin: 0 0 2px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-secondary, #9aa09a);
}

/*
  목표 상세 화면의 매물 시세 변화 카드(MarketPriceAlertCard의 "유지 시 → 반영 시" 비교 패널)와
  같은 구조를 재사용한다 — 배경 박스 안에 두 값을 나란히 두고 화살표로 잇는다. 다만 거기서는
  "반영 시" 값을 --color-primary(초록)로 강조하는데, 여기서는 시점이 늦어지거나 더 준비해야
  하는 값일 수도 있어 긍정적 강조색을 새로 쓰지 않고 font-weight 차이로만 구분한다.
*/
.recommendation-compare-card__compare {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: var(--color-app-bg, #111111);
  border-radius: 10px;
}

.recommendation-compare-card__compare-box {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.recommendation-compare-card__compare-arrow {
  flex-shrink: 0;
  font-size: 13px;
  color: var(--color-text-secondary, #9aa09a);
}

.recommendation-compare-card__row-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary, #9aa09a);
}

.recommendation-compare-card__row-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-secondary, #9aa09a);
}

/* "→" 오른쪽 값이 이 카드가 강조하려는 결과값이므로(예: 필요 월 저축, 예상 도달 시점,
   선택의 폭 확대 후 조건) primary 텍스트 톤 + 굵기로 한 단계 강조한다. */
.recommendation-compare-card__row-value--emphasis {
  font-size: 17px;
  font-weight: 800;
  color: var(--color-text-primary, #ffffff);
}
</style>
