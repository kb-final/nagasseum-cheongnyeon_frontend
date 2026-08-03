<script setup>
import { computed, ref, watch } from 'vue'

import BaseModal from '@/shared/components/atoms/feedback/Modal/BaseModal.vue'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import BaseChipGroup from '@/shared/components/atoms/form/ChipGroup/BaseChipGroup.vue'
import BaseInput from '@/shared/components/atoms/base/input/BaseInput.vue'
import { formatManwon, formatYearMonthKo } from '@/shared/utils/formatter'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // goalStore.goalDetail 그대로 ({ progress, savingStatus, forecasts, ... })
  detail: { type: Object, required: true },
  isSubmitting: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const CUSTOM = 'CUSTOM'

// 추천 금액 = 상세 조회에서 내려온 실제 저축 기준(최근 3개월 평균 / 최근 저축액).
// 지금 계획 금액과 같은 값은 바꿀 이유가 없으므로 제외한다.
const recommendedAmounts = computed(() => {
  const fixed = props.detail.savingStatus.fixedSaving
  const amounts = props.detail.forecasts
    .filter((forecast) => forecast.basis !== 'FIXED')
    .map((forecast) => forecast.monthlySaving)
    .filter((amount) => typeof amount === 'number' && amount > 0 && amount !== fixed)

  return [...new Set(amounts)].sort((a, b) => a - b)
})

const options = computed(() => [
  ...recommendedAmounts.value.map((amount) => ({ value: amount, label: formatManwon(amount) })),
  { value: CUSTOM, label: '직접 입력' },
])

const selected = ref(null)
const customInput = ref('')

// 팝업을 다시 열 때마다 첫 추천 금액(없으면 직접 입력)으로 초기화한다.
watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) return
    selected.value = recommendedAmounts.value[0] ?? CUSTOM
    customInput.value = ''
  },
  { immediate: true },
)

const customAmount = computed(() => Number(customInput.value.replace(/\D/g, '')) || 0)

const amount = computed(() => (selected.value === CUSTOM ? customAmount.value : selected.value))

function onCustomInput(value) {
  const digits = String(value).replace(/\D/g, '')
  customInput.value = digits ? Number(digits).toLocaleString('ko-KR') : ''
}

// 남은 금액을 월 저축액으로 나눈 개월 수. 백엔드 forecasts와 같은 계산식이라,
// 추천 금액을 고를 때는 응답 값을 그대로 쓰고 직접 입력한 금액만 여기서 계산한다.
function monthsToGoal(monthlySaving) {
  if (!monthlySaving) return null
  return Math.ceil(props.detail.progress.remainingAmount / monthlySaving)
}

function addMonths(monthsAhead) {
  const date = new Date()
  date.setMonth(date.getMonth() + monthsAhead)
  return date
}

const fixedForecast = computed(
  () => props.detail.forecasts.find((forecast) => forecast.basis === 'FIXED') ?? null,
)

const preview = computed(() => {
  if (!amount.value || !fixedForecast.value?.expectedDate) return null

  const matched = props.detail.forecasts.find(
    (forecast) => forecast.monthlySaving === amount.value && forecast.expectedDate,
  )

  const months = monthsToGoal(amount.value)
  const fixedMonths = monthsToGoal(props.detail.savingStatus.fixedSaving)

  return {
    amount: amount.value,
    currentDate: formatYearMonthKo(fixedForecast.value.expectedDate),
    expectedDate: matched
      ? formatYearMonthKo(matched.expectedDate)
      : formatYearMonthKo(addMonths(months)),
    monthsDiff: matched ? matched.monthsDiff : fixedMonths - months,
  }
})

const canSubmit = computed(() => amount.value > 0 && !props.isSubmitting)

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <div class="saving-edit">
      <h2 class="saving-edit__title">월 저축 계획 수정</h2>

      <div class="saving-edit__current">
        <span class="saving-edit__current-label">현재 월 저축 계획</span>
        <strong class="saving-edit__current-value">
          {{ formatManwon(detail.savingStatus.fixedSaving) }}
        </strong>
      </div>

      <p class="saving-edit__section-label">추천 금액</p>
      <BaseChipGroup v-model="selected" :options="options" size="sm" />

      <div v-if="selected === CUSTOM" class="saving-edit__custom">
        <BaseInput
          class="saving-edit__custom-input"
          :model-value="customInput"
          type="text"
          inputmode="numeric"
          placeholder="금액을 입력하세요"
          @update:model-value="onCustomInput"
        />
        <span class="saving-edit__custom-unit">원</span>
      </div>

      <div v-if="preview" class="saving-edit__preview">
        <p class="saving-edit__preview-line">월 {{ formatManwon(preview.amount) }}으로 변경하면</p>
        <p class="saving-edit__preview-line">예상 달성일이 {{ preview.currentDate }}에서</p>
        <p class="saving-edit__preview-line saving-edit__preview-line--accent">
          <template v-if="preview.monthsDiff > 0">
            {{ preview.expectedDate }}로 {{ preview.monthsDiff }}개월 앞당겨져요.
          </template>
          <template v-else-if="preview.monthsDiff < 0">
            {{ preview.expectedDate }}로 {{ -preview.monthsDiff }}개월 늦어져요.
          </template>
          <template v-else> {{ preview.expectedDate }}로 그대로예요. </template>
        </p>
      </div>

      <p class="saving-edit__note">
        목표 달성 계산에 반영되는 계획 금액이며, 실제 자동이체 금액은 변경되지 않아요.
      </p>
    </div>

    <template #footer>
      <BaseButton variant="secondary" size="modal" @click="close">취소</BaseButton>
      <BaseButton
        variant="primary"
        size="modal"
        :disabled="!canSubmit"
        @click="emit('submit', amount)"
      >
        수정 완료
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.saving-edit {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.saving-edit__title {
  margin: 0 0 2px;
  color: #0b3b24;
  font-size: 17px;
  font-weight: 400;
}

.saving-edit__current {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--card-bg, #161616);
}

.saving-edit__current-label {
  color: #888888;
  font-size: 11px;
}

.saving-edit__current-value {
  color: var(--accent, #e3ffe8);
  font-size: 16px;
  font-weight: 400;
}

.saving-edit__section-label {
  margin: 2px 0 0;
  color: #404040;
  font-size: 12px;
}

.saving-edit__custom {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border-radius: 12px;
  background: var(--card-bg, #161616);
}

/* BaseModal이 Teleport로 body에 렌더링돼 조상 기반 :deep()이 안 먹으므로
   자식 컴포넌트 루트에 클래스를 직접 붙여 오버라이드한다 (DiagnosisResultModal과 같은 방식) */
.saving-edit__custom-input {
  border: none;
  background: transparent;
  color: var(--accent, #e3ffe8);
  font-size: 14px;
  padding: 14px 0;
}

.saving-edit__custom-input:focus {
  outline: none;
}

.saving-edit__custom-unit {
  flex-shrink: 0;
  color: #888888;
  font-size: 13px;
}

.saving-edit__preview {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px;
  border: 1px solid var(--border, #262626);
  border-radius: 12px;
  background: var(--card-bg, #161616);
}

.saving-edit__preview-line {
  margin: 0;
  color: #dddddd;
  font-size: 13px;
}

.saving-edit__preview-line--accent {
  color: #7fe3a0;
}

.saving-edit__note {
  margin: 0;
  color: #404040;
  font-size: 11px;
  line-height: 1.4;
}
</style>
