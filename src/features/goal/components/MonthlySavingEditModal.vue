<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import BaseModal from '@/shared/components/atoms/feedback/Modal/BaseModal.vue'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import BaseChipGroup from '@/shared/components/atoms/form/ChipGroup/BaseChipGroup.vue'
import BaseInput from '@/shared/components/atoms/base/input/BaseInput.vue'
import { formatManwon, formatYearMonthKo } from '@/shared/utils/formatter'

import { useGoalStore } from '@/features/goal/store/goalStore'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // goalStore.goalDetail 그대로 ({ progress, savingStatus, forecasts, ... })
  detail: { type: Object, required: true },
  isSubmitting: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const goalStore = useGoalStore()

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
    if (!isOpen) {
      goalStore.clearSavingSimulation()
      return
    }

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

const fixedForecast = computed(
  () => props.detail.forecasts.find((forecast) => forecast.basis === 'FIXED') ?? null,
)

const isCustom = computed(() => selected.value === CUSTOM)

// 금액이 바뀌면 이전 시뮬레이션 결과는 더 이상 그 금액의 결과가 아니므로 지운다.
// (다시 보려면 [시뮬레이션 돌리기]를 눌러야 한다)
watch(amount, () => {
  goalStore.clearSavingSimulation()
})

onBeforeUnmount(() => {
  goalStore.clearSavingSimulation()
})

function runSimulation() {
  goalStore.loadSavingSimulation(props.detail.goalId, amount.value)
}

// 추천 금액 = 상세 조회 forecasts, 직접 입력 = 시뮬레이션 API 응답. 필드 구조가 같아 그대로 쓴다.
const forecast = computed(() => {
  if (!amount.value) return null
  if (isCustom.value) return goalStore.savingSimulation

  return props.detail.forecasts.find((item) => item.monthlySaving === amount.value) ?? null
})

const preview = computed(() => {
  if (!forecast.value || !fixedForecast.value?.expectedDate) return null

  return {
    amount: forecast.value.monthlySaving,
    currentDate: formatYearMonthKo(fixedForecast.value.expectedDate),
    // 남은 금액이 0이면 expectedDate가 null로 온다(이미 달성)
    expectedDate: forecast.value.expectedDate
      ? formatYearMonthKo(forecast.value.expectedDate)
      : null,
    monthsDiff: forecast.value.monthsDiff,
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
      <BaseChipGroup v-model="selected" class="saving-edit__chips" :options="options" size="sm" />

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

      <div v-if="preview || isCustom" class="saving-edit__preview">
        <template v-if="preview">
          <p class="saving-edit__preview-line">
            월 {{ formatManwon(preview.amount) }}으로 변경하면
          </p>
          <template v-if="preview.expectedDate">
            <p class="saving-edit__preview-line">예상 달성일이 {{ preview.currentDate }}에서</p>
            <p class="saving-edit__preview-line saving-edit__preview-line--accent">
              <template v-if="preview.monthsDiff > 0">
                {{ preview.expectedDate }}로 {{ preview.monthsDiff }}개월 앞당겨져요.
              </template>
              <template v-else-if="preview.monthsDiff < 0">
                {{ preview.expectedDate }}로 {{ -preview.monthsDiff }}개월 늦어져요.
              </template>
              <template v-else-if="preview.monthsDiff === 0">
                {{ preview.expectedDate }}로 그대로예요.
              </template>
              <template v-else> {{ preview.expectedDate }}에 달성할 것으로 예상돼요. </template>
            </p>
          </template>
          <p v-else class="saving-edit__preview-line saving-edit__preview-line--accent">
            이미 목표 금액을 모았어요.
          </p>
        </template>

        <p v-else-if="goalStore.simulationError" class="saving-edit__preview-placeholder">
          예상 달성일을 계산하지 못했어요.
        </p>
        <p v-else class="saving-edit__preview-placeholder">
          금액을 입력하고 예상 달성일을 확인해보세요.
        </p>

        <!-- 직접 입력한 금액은 이 버튼을 눌렀을 때만 서버에 계산을 요청한다.
             결과가 나오면 버튼은 감추고, 금액을 바꾸면 결과가 지워지면서 다시 나타난다 -->
        <div v-if="isCustom && !preview" class="saving-edit__simulate">
          <BaseButton
            class="saving-edit__simulate-button"
            variant="primary"
            size="md"
            :disabled="!amount || goalStore.isSimulating"
            @click="runSimulation"
          >
            {{ goalStore.isSimulating ? '계산 중...' : '시뮬레이션 돌리기' }}
          </BaseButton>
        </div>
      </div>

      <p class="saving-edit__note">
        목표 달성 계산에 반영되는 계획 금액이며,<br />실제 자동이체 금액은 변경되지 않아요.
      </p>
    </div>

    <template #footer>
      <BaseButton class="saving-edit__cancel-button" variant="secondary" @click="close"
        >취소</BaseButton
      >
      <BaseButton
        class="saving-edit__submit-button"
        variant="primary"
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
  font-weight: 600;
}

.saving-edit__title {
  margin: 0 0 2px;
  color: var(--color-text-primary, #0b3b24);
  font-size: 17px;
  font-weight: 700;
  text-align: center;
}

.saving-edit__current {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--color-surface, #f7f8f4);
}

.saving-edit__current-label {
  color: var(--color-text-tertiary, #888888);
  font-size: 11px;
}

.saving-edit__current-value {
  color: var(--color-primary, #1d6b3f);
  font-size: 16px;
  font-weight: 700;
}

.saving-edit__section-label {
  margin: 2px 0 0;
  color: var(--color-text-tertiary, #404040);
  font-size: 12px;
}

.saving-edit__custom {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border-radius: 12px;
  background: var(--color-surface, #f7f8f4);
}

/* BaseModal이 Teleport로 body에 렌더링돼 조상 기반 :deep()이 안 먹으므로
   자식 컴포넌트 루트에 클래스를 직접 붙여 오버라이드한다 (DiagnosisResultModal과 같은 방식) */
.saving-edit__custom-input {
  border: none;
  background: transparent;
  color: var(--color-text-primary, #0b3b24);
  font-size: 14px;
  padding: 14px 0;
}

.saving-edit__custom-input:focus {
  outline: none;
}

.saving-edit__custom-unit {
  flex-shrink: 0;
  color: var(--color-text-tertiary, #888888);
  font-size: 13px;
}

.saving-edit__preview {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--color-surface, #f7f8f4);
}

.saving-edit__preview-line {
  margin: 0;
  color: var(--color-text-primary, #dddddd);
  font-size: 13px;
}

.saving-edit__preview-line--accent {
  color: var(--color-primary, #7fe3a0);
}

.saving-edit__preview-placeholder {
  margin: 0;
  color: var(--color-text-tertiary, #888888);
  font-size: 12px;
}

.saving-edit__simulate {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.saving-edit__simulate-button {
  width: auto;
  height: 34px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  background: var(--color-primary-soft, #e8f4ea);
  color: #353934;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

/* 팝업 버튼 색을 CTA(고정 저축액 변경하기)와 같은 톤으로 통일한다.
   footer 슬롯 버튼은 .saving-edit의 DOM 형제라 :deep()이 안 먹으므로,
   버튼 루트에 직접 붙인 클래스를 일반 선택자로 바로 오버라이드한다.
   취소 버튼은 색은 secondary variant 기본값 그대로 두고 그림자만 준다. */
.saving-edit__cancel-button {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.saving-edit__submit-button {
  background: var(--color-primary-soft, #e8f4ea);
  color: #353934;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

/* 칩(핀)에도 같은 약한 그림자를 준다. BaseChipGroup은 일반 자식이라 :deep()으로 닿는다.
   선택 안 된 칩의 테두리도 여기서 없앤다. */
.saving-edit :deep(.saving-edit__chips) .chip-group__item {
  border: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

/* 선택된 칩(핀) 색도 버튼과 같은 톤으로. */
.saving-edit :deep(.saving-edit__chips) .chip-group__item--active {
  background: var(--color-primary-soft, #e8f4ea);
  color: #353934;
}

.saving-edit__note {
  margin: 0;
  color: var(--color-text-tertiary, #404040);
  font-size: 11px;
  line-height: 1.4;
}
</style>
