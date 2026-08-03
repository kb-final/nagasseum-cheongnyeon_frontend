<script setup>
import { computed } from 'vue'

import BaseModal from '@/shared/components/atoms/feedback/Modal/BaseModal.vue'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import { formatEok, formatManwon } from '@/shared/utils/formatter'

import BudgetPercentileGauge from '@/features/goal/components/BudgetPercentileGauge.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  conditionSummary: { type: String, default: '' },
  result: { type: Object, default: null }, // goalStore.diagnosisResult 그대로: { budget, results }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const resultItem = computed(() => props.result?.results?.[0] ?? null)
const marketStats = computed(() => resultItem.value?.marketStats ?? null)
const isSufficient = computed(() => resultItem.value?.status === 'SUFFICIENT')
const shortfall = computed(() => resultItem.value?.shortfall ?? 0)

function formatYearMonth(ym) {
  const [year, month] = ym.split('-')
  return `${year}년 ${Number(month)}월`
}

// adjustmentSuggestions의 type별로 카드에 보여줄 라벨/값 텍스트를 만든다
function formatSuggestion(item) {
  switch (item.type) {
    case 'INCREASE_SAVINGS':
      return {
        type: item.type,
        label: '월 저축 조정',
        value: `+${formatManwon(item.deltaMonthlySavings)}
         → ${formatManwon(item.newMonthlySavings)}`,
      }
    case 'EXTEND_TIMELINE':
      return {
        type: item.type,
        label: '목표 시점 조정',
        value: `+${item.deltaMonths}개월 → ${formatYearMonth(item.newTargetDate)}`,
      }
    case 'REDUCE_SIZE':
      return {
        type: item.type,
        label: '평수 조정',
        value: `${item.deltaSizeMax}평 → ${item.newSizeMax}평`,
      }
    case 'NEARBY_REGION':
      return {
        type: item.type,
        label: '인근 지역으로 이동',
        value: item.suggestedRegions?.length ? item.suggestedRegions.join(', ') : '중앙값 낮은 곳',
      }
    default:
      return { type: item.type, label: '', value: '' }
  }
}

const planAdjustments = computed(() =>
  (resultItem.value?.adjustmentSuggestions?.planAdjustments ?? []).map(formatSuggestion),
)
const conditionAdjustments = computed(() =>
  (resultItem.value?.adjustmentSuggestions?.conditionAdjustments ?? []).map(formatSuggestion),
)
</script>

<template>
  <BaseModal
    title="진단 결과"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template v-if="resultItem">
      <div class="diagnosis-result__condition-card">
        <p class="diagnosis-result__condition">{{ conditionSummary }}</p>
        <p class="diagnosis-result__stat">
          이 조건 매매가 중앙값 · {{ formatEok(marketStats.median) }}
        </p>
        <p class="diagnosis-result__stat diagnosis-result__stat--budget">
          내 계산된 예산 · {{ formatEok(result.budget.totalBudget) }}
        </p>

        <BudgetPercentileGauge
          :p25="marketStats.p25"
          :median="marketStats.median"
          :p75="marketStats.p75"
          :my-budget="result.budget.totalBudget"
          :is-sufficient="isSufficient"
        />
      </div>

      <div
        class="diagnosis-result__message"
        :class="
          isSufficient
            ? 'diagnosis-result__message--sufficient'
            : 'diagnosis-result__message--insufficient'
        "
      >
        <template v-if="isSufficient">
          <p class="diagnosis-result__message-title">여유롭게 달성 가능</p>
          <p class="diagnosis-result__message-body">이 조건 그대로 목표로 잡아도 좋아요.</p>
        </template>
        <template v-else>
          <p class="diagnosis-result__message-title">예산이 부족해요</p>
          <p class="diagnosis-result__message-body">
            평수·지역을 낮추거나 저축·기간을 늘려 보세요.
          </p>
        </template>
      </div>

      <div v-if="!isSufficient" class="diagnosis-result__suggestions">
        <p class="diagnosis-result__suggestions-note">
          현재 예산이 중앙값보다 {{ formatManwon(shortfall) }} 부족합니다. <br />아래 중 하나면
          도달해요.
        </p>

        <p class="diagnosis-result__group-label">내 계획 조절</p>
        <div class="diagnosis-result__cards">
          <div v-for="item in planAdjustments" :key="item.type" class="diagnosis-result__card">
            <p class="diagnosis-result__card-label">{{ item.label }}</p>
            <p class="diagnosis-result__card-value">{{ item.value }}</p>
          </div>
        </div>

        <p class="diagnosis-result__group-label">집 조건 조절</p>
        <div class="diagnosis-result__cards">
          <div v-for="item in conditionAdjustments" :key="item.type" class="diagnosis-result__card">
            <p class="diagnosis-result__card-label">{{ item.label }}</p>
            <p class="diagnosis-result__card-value">{{ item.value }}</p>
          </div>
        </div>
      </div>

      <div class="diagnosis-result__actions">
        <BaseButton
          class="diagnosis-result__footer-btn"
          variant="secondary"
          size="modal"
          @click="emit('update:modelValue', false)"
        >
          다시 진단하기
        </BaseButton>
        <BaseButton
          class="diagnosis-result__footer-btn"
          variant="primary"
          size="modal"
          @click="emit('confirm')"
        >
          이 목표로 설정
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.diagnosis-result__condition-card {
  padding: 10px 16px;
  margin-bottom: 12px;
  border-radius: 16px;
  background: #e3ffe8;
}

.diagnosis-result__condition {
  margin: 0 0 8px;
  color: #4a5a52;
  font-size: 11px;
}

.diagnosis-result__stat {
  margin: 0 0 4px;
  color: #1f2b25;
  font-size: 13px;
}

.diagnosis-result__stat--budget {
  margin-bottom: 12px;
  font-weight: 700;
}

.diagnosis-result__message {
  margin: 12px 0;
  padding: 10px 16px;
  border-radius: 16px;
}

.diagnosis-result__message--insufficient {
  background: #3a1512;
  border: 1px solid rgba(224, 122, 107, 0.4);
}

.diagnosis-result__message--insufficient .diagnosis-result__message-title {
  color: #e07a6b;
  font-size: 13px;
}

.diagnosis-result__message--insufficient .diagnosis-result__message-body {
  color: #e07a6b;
  font-size: 11px;
}

.diagnosis-result__message--sufficient {
  background: #0e3b2a;
  border: 1px solid rgba(127, 227, 160, 0.35);
}

.diagnosis-result__message--sufficient .diagnosis-result__message-title {
  color: #7fe3a0;
}

.diagnosis-result__message--sufficient .diagnosis-result__message-body {
  color: #7fe3a0;
}

.diagnosis-result__message-title {
  margin: 0 0 4px;
  font-weight: 700;
}

.diagnosis-result__message-body {
  margin: 0;
  color: #4a5a52;
  font-size: 13px;
}

.diagnosis-result__suggestions {
  padding: 10px 10px;
  border-radius: 16px;
  background: #161616;
}

.diagnosis-result__suggestions-note {
  margin: 0 0 8px;
  color: #e3ffe8;
  font-size: 11px;
}

.diagnosis-result__group-label {
  margin: 2px 0 6px;
  color: #b6b6b6;
  font-size: 11px;
  font-weight: 700;
}

.diagnosis-result__cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 8px;
}

.diagnosis-result__card {
  padding: 5px 10px;
  border-radius: 14px;
  background: #e3ffe8;
}

.diagnosis-result__card-label {
  margin: 0 0 4px;
  color: #4a5a52;
  font-size: 11px;
}

.diagnosis-result__card-value {
  margin: 0;
  color: #1f2b25;
  font-size: 13px;
  font-weight: 700;
}

/* 버튼을 footer 슬롯 대신 스크롤되는 본문 맨 아래에 배치한다 */
.diagnosis-result__actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

/* 팝업 가로 폭이 좁아져 기본 폰트 크기로는 버튼 글자가 줄바꿈된다 — 이 버튼만 축소.
   BaseModal이 Teleport로 body에 렌더링되어 조상 기반 :deep() 선택자가 안 먹히므로,
   버튼에 직접 클래스를 붙여 plain scoped 선택자로 오버라이드한다. */
.diagnosis-result__footer-btn {
  padding: 0 6px;
  font-size: 13px;
}
</style>
