<script setup>
import partyImage from '@/features/compare/assets/party.png'

defineProps({
  cohortSize: { type: Number, required: true },
  assetRangeLabel: { type: String, required: true },
  ageRangeLabel: { type: String, required: true },
})

defineEmits(['edit'])
</script>

<template>
  <section class="cohort-card">
    <div class="cohort-card__head">
      <h2 class="cohort-card__title">내 코호트 기준</h2>
      <button type="button" class="cohort-card__edit" @click="$emit('edit')">
        수정
        <svg width="7" height="9" viewBox="0 0 8 10" aria-hidden="true">
          <path d="M0 0L8 5L0 10Z" fill="currentColor" />
        </svg>
      </button>
    </div>

    <div class="cohort-card__chips">
      <span class="chip">{{ assetRangeLabel }}</span>
      <span class="chip">{{ ageRangeLabel }}</span>
    </div>

    <p class="cohort-card__summary">
      <img class="cohort-card__icon" :src="partyImage" alt="" />
      <span
        ><b>{{ cohortSize.toLocaleString() }}명</b>의 파티원들과 비교 중</span
      >
    </p>
  </section>
</template>

<style scoped>
/* 폰트 크기는 rem이 아닌 px로 고정한다.
   루트가 18px/16px로 바뀌면 픽셀 폰트가 그리드에서 어긋나 뭉개진다. */
.cohort-card {
  /* 이 카드에서만 쓰는 색 */
  --surface: #171b16;
  --chip-bg: #232823;
  --chip-text: #ffd939;
  --mint: #9fd8ab;

  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 16px;
  background: var(--surface);
  /* 루트의 145%는 18px 기준으로 계산된 26.1px이 그대로 상속된다.
     단위 없는 값으로 덮어써야 각 요소가 제 폰트 크기로 줄 높이를 계산한다. */
  line-height: 1.45;
}

.cohort-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cohort-card__title {
  margin: 0;
  font-size: 14px;
}

.cohort-card__edit {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  padding: 0;
  background: none;
  font-size: 13px;
  color: var(--mint);
  cursor: pointer;
}

.cohort-card__chips {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 3px 10px;
  background: var(--chip-bg);
  font-size: 12px;
  color: var(--chip-text);
}

.cohort-card__summary {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 0;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 7px 12px;
  background: var(--bg);
  font-size: 13px;
  color: var(--mint);
}

/* 원본이 8×8 도트라 8의 배수(16px)로 그려야 픽셀이 고르게 나온다. */
.cohort-card__icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  image-rendering: pixelated;
}

.cohort-card__summary b {
  font-weight: inherit;
}
</style>
