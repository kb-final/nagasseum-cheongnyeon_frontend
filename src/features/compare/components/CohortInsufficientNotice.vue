<script setup>
import StateNoticeCard from '@/features/compare/components/StateNoticeCard.vue'

defineProps({
  cohortSize: { type: Number, required: true },
  minimumRequired: { type: Number, required: true },
  canWiden: { type: Boolean, required: true },
})

defineEmits(['widen'])
</script>

<template>
  <StateNoticeCard eyebrow="집계 대기" title="아직 비교 데이터가 부족합니다">
    같은 자산·나이 범위의 또래가 {{ cohortSize }}명뿐이에요. 최소 {{ minimumRequired }}명이 모이면
    정확한 비교 결과를 보여드릴게요.
    <div class="gauge">
      <span class="gauge__track">
        <span
          class="gauge__fill"
          :style="{ width: `${(cohortSize / minimumRequired) * 100}%` }"
        ></span>
      </span>
      <span class="gauge__label">{{ cohortSize }} / {{ minimumRequired }}명</span>
    </div>

    <template #action>
      <button type="button" class="state-card__cta state-card__cta--button" @click="$emit('widen')">
        {{ canWiden ? '비교 범위 넓히기' : '비교 기준 수정하기' }}
      </button>
      <p v-if="!canWiden" class="state-card__hint">
        자산·나이 범위를 가장 넓게 잡아도 또래가 모이지 않았어요.<br />추가 조건을 해제하면 도움이
        될 수 있어요.
      </p>
    </template>
  </StateNoticeCard>
</template>

<style scoped>
.gauge {
  margin-top: 11px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.gauge__track {
  flex: 1;
  height: 6px;
  background: var(--c-track);
  overflow: hidden;
}

.gauge__fill {
  display: block;
  height: 100%;
  background: var(--c-accent);
}

.gauge__label {
  font-size: 10.5px;
  color: var(--c-ink-muted);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.state-card__cta {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  padding: 8px 15px;
  border-radius: 999px;
  background: var(--c-accent);
  color: var(--c-on-accent);
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.state-card__cta--button {
  border: 0;
  font-family: inherit;
  cursor: pointer;
}

.state-card__hint {
  margin: 12px 0 0;
  font-size: 11px;
  line-height: 1.6;
  color: var(--c-ink-muted);
  opacity: 0.75;
}
</style>
