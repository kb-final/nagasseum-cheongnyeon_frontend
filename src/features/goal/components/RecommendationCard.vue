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

    <p class="recommendation-card__condition">{{ view.conditionSummary }}</p>

    <div class="recommendation-card__stats">
      <div class="recommendation-card__stat">
        <span class="recommendation-card__stat-label">{{ view.leftLabel }}</span>
        <strong
          class="recommendation-card__stat-value"
          :class="
            view.resultSide === 'left'
              ? 'recommendation-card__stat-value--primary'
              : 'recommendation-card__stat-value--secondary'
          "
          >{{ view.leftValue }}</strong
        >
      </div>
      <div class="recommendation-card__stat">
        <span class="recommendation-card__stat-label">{{ view.rightLabel }}</span>
        <strong
          class="recommendation-card__stat-value"
          :class="
            view.resultSide === 'right'
              ? 'recommendation-card__stat-value--primary'
              : 'recommendation-card__stat-value--secondary'
          "
          >{{ view.rightValue }}</strong
        >
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
  gap: 5px;
  /* BaseCard--lg의 기본 상하 padding(20px)이 세 카드를 나란히 비교하기엔 다소 여유로워
     상하만 20%가량 줄인다. 좌우는 다른 카드들과의 정렬을 위해 그대로 둔다. */
  padding-top: 16px;
  padding-bottom: 16px;
  cursor: pointer;
}

.recommendation-card:focus-visible {
  outline: 2px solid var(--color-primary, #1d6b3f);
  outline-offset: 2px;
}

.recommendation-card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text-primary, #ffffff);
}

.recommendation-card__strategy {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary, #1d6b3f);
}

/* BaseDivider 기본값은 테마를 안 타는 legacy 변수(--border)라 라이트 모드에서 너무 짙게
   보인다. 마이페이지(.my-page-view__row)와 같은 테마별 톤(--color-border)으로 맞춘다. */
.recommendation-card__divider {
  margin: 3px 0 9px;
  background: var(--color-border, #262626);
}

/* 지역·유형·거래·면적을 한 줄로 합친 요약. 빠른 비교가 목적이라 상세 화면처럼 줄바꿈해서
   나누지 않는다. 폭이 좁아 다 안 들어가면(긴 지역명 등) 잘라내지 않고 자연스럽게 줄바꿈한다. */
.recommendation-card__condition {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary, #ffffff);
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
  color: var(--color-text-primary, #ffffff);
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 두 값 중 실제 "계산된 결과값"(view.resultSide) 쪽만 font-weight를 한 단계 높인다 — 크기는
   그대로 두고 무게감만 벌린다. type마다 결과값이 왼쪽/오른쪽 어디에 오는지 달라(예:
   PREFERENCE_SAVING_FIXED는 오른쪽 "예상 도달 시점", REALISTIC은 왼쪽 "목표 금액") 클래스는
   위치가 아니라 템플릿에서 resultSide로 골라 붙인다. 새 색상·배경은 쓰지 않는다. */
.recommendation-card__stat-value--primary {
  font-weight: 800;
}

.recommendation-card__stat-value--secondary {
  font-weight: 600;
}

.recommendation-card__more {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  margin-top: 10px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary, #1d6b3f);
}
</style>
