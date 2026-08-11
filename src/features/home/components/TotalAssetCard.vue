<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import { formatNumber } from '@/shared/utils/formatter'

import assetIcon from '@/assets/images/assetIcon.png'
import refreshIcon from '@/assets/images/refreshIcon.png'

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
</script>

<template>
  <BaseCard class="total-asset-card">
    <div class="total-asset-card__top">
      <span class="total-asset-card__label">
        총 자산
        <img class="total-asset-card__label-icon" :src="assetIcon" alt="" />
      </span>
      <RouterLink class="total-asset-card__detail" to="/assets">자세히 ▷</RouterLink>
    </div>

    <div class="total-asset-card__main">
      <p class="total-asset-card__amount">
        {{ amount }}<span class="total-asset-card__unit">원</span>
      </p>

      <BaseButton
        variant="secondary"
        class="total-asset-card__refresh-btn"
        @click="$emit('refresh')"
      >
        <img class="total-asset-card__refresh-icon" :src="refreshIcon" alt="" />갱신
      </BaseButton>
    </div>
  </BaseCard>
</template>

<style scoped>
/*
  글자색 두 단계. 금액·라벨은 --ink, 보조 정보는 --ink-muted.
  opacity 대신 색을 직접 준다. 투명도로 흐리게 하면 배경색이 바뀔 때 같이 흔들린다.
*/
.total-asset-card {
  --ink: #12281c;
  --ink-muted: #8a8f63;

  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border-radius: 0;
  background: var(--color-card-highlight, #f7ffd1);
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
}

.total-asset-card__label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--ink);
}

/* 픽셀 그림은 브라우저가 부드럽게 늘리면 뿌옇게 뭉갠다. 크기도 정수 배율로 맞춘다. */
.total-asset-card__label-icon {
  width: 12px;
  height: 12px;
  image-rendering: pixelated;
}

.total-asset-card__detail {
  font-size: 12px;
  color: var(--ink-muted);
  text-decoration: none;
}

.total-asset-card__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.total-asset-card__amount {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 700;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

/* 단위는 숫자보다 작고 가볍게. 금액이 먼저 읽혀야 한다. */
.total-asset-card__unit {
  margin-left: 5px;
  font-size: 16px;
  font-weight: 400;
}

.total-asset-card :deep(.total-asset-card__refresh-btn) {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex: none;
  width: auto;
  height: 30px;
  padding: 0 12px;
  border-radius: 0;
  background: #12281c;
  color: var(--color-card-highlight, #f7ffd1);
  font-size: 12px;
  font-weight: 400;
}

.total-asset-card__refresh-icon {
  width: 11px;
  height: 11px;
  image-rendering: pixelated;
}
</style>
