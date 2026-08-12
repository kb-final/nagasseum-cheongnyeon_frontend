<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import BaseRefreshIcon from '@/shared/components/atoms/base/icon/BaseRefreshIcon.vue'
import { formatNumber, formatDateTimeDot } from '@/shared/utils/formatter'

import assetIcon from '@/assets/images/assetIcon.png'

const props = defineProps({
  assetSummary: { type: Object, required: true },
})

defineEmits(['refresh'])

/**
 * 금액과 '원'을 따로 그린다.
 *
 * <p>숫자만 크게 두고 단위는 작게 놓아야 금액이 먼저 읽힌다. formatWon은 둘을 한 문자열로
 * 붙여줘서 크기를 나눌 수 없다.
 */
const amount = computed(() => formatNumber(props.assetSummary.totalAssets))
const syncedAt = computed(() => formatDateTimeDot(props.assetSummary.syncedAt))
</script>

<template>
  <BaseCard class="total-asset-card">
    <div class="total-asset-card__top">
      <span class="total-asset-card__label">
        총 자산
        <img class="total-asset-card__label-icon" :src="assetIcon" alt="" />
      </span>
      <RouterLink class="total-asset-card__detail" to="/assets">자세히 ›</RouterLink>
    </div>

    <div class="total-asset-card__main">
      <p class="total-asset-card__amount">
        {{ amount }}<span class="total-asset-card__unit">원</span>
      </p>
    </div>

    <div class="total-asset-card__meta">
      <span class="total-asset-card__synced-at">{{ syncedAt }} 기준</span>
      <button
        type="button"
        class="total-asset-card__refresh-btn"
        aria-label="자산 정보 갱신"
        @click="$emit('refresh')"
      >
        <BaseRefreshIcon :size="14" bold />
      </button>
    </div>
  </BaseCard>
</template>

<style scoped>
/*
  글자색 두 단계. 금액·라벨은 진하게, 보조 정보는 흐리게.
  opacity 대신 색을 직접 준다. 투명도로 흐리게 하면 배경색이 바뀔 때 같이 흔들린다.
  (main.css의 [data-theme] 블록에서 테마별 값을 정의한다.)
*/
.total-asset-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  /* BaseCard 기본 20px 패딩 중 아래쪽만 살짝 줄인다. */
  padding-bottom: 12px;
  background: var(--total-asset-surface, #f7ffd1);
  font-family: var(--sans-normal);
  letter-spacing: 0.02em;
  /*
    루트의 145%는 18px 기준으로 계산된 26.1px이 그대로 상속된다. 여기 글자는 12~28px이라
    줄 사이가 들쭉날쭉해진다. 단위 없는 값으로 덮어써야 각 글자 크기에 맞춰 계산된다.
  */
  line-height: 1.25;
}

.total-asset-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* 카드 전체 gap을 4px로 좁혀서 금액 바로 아래 갱신 정보 줄을 붙였다.
     라벨 줄과 금액 줄 사이는 그만큼 여기서 다시 벌려준다. */
  margin-bottom: 8px;
}

.total-asset-card__label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 700;
  color: var(--total-asset-label, #12281c);
}

/* 픽셀 그림은 브라우저가 부드럽게 늘리면 뿌옇게 뭉갠다. 크기도 정수 배율로 맞춘다. */
.total-asset-card__label-icon {
  width: 12px;
  height: 12px;
  image-rendering: pixelated;
}

.total-asset-card__detail {
  font-size: 12px;
  font-weight: 700;
  color: var(--total-asset-detail, #8a8f63);
  text-decoration: none;
}

.total-asset-card__main {
  display: flex;
  align-items: center;
}

.total-asset-card__amount {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 900;
  color: var(--home-ink-text, #12281c);
  font-variant-numeric: tabular-nums;
}

/* 단위는 숫자보다 작고 가볍게. 금액이 먼저 읽혀야 한다. */
.total-asset-card__unit {
  margin-left: 5px;
  font-size: 16px;
  font-weight: 700;
}

/* 갱신 시각 + 새로고침 아이콘을 금액 아래 한 줄로, 오른쪽 정렬로 붙인다.
   금액 줄과 살짝 더 떨어지도록 위쪽에 여백을 조금 더 준다. */
.total-asset-card__meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 4px;
}

.total-asset-card__synced-at {
  font-size: 11px;
  font-weight: 700;
  color: var(--total-asset-detail, #8a8f63);
}

/* 검정 pill 버튼 대신 아이콘만 노출한다. 클릭 영역은 캡션 줄에 맞춰 28px로 줄이되
   아이콘(14px)보다 넉넉하게 잡아 탭하기 편하게 둔다. */
.total-asset-card__refresh-btn {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: none;
  color: var(--total-asset-label, #12281c);
  cursor: pointer;
}
</style>
