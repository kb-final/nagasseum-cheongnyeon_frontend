<script setup>
import { computed, ref, watch } from 'vue'

import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import BaseInput from '@/shared/components/atoms/base/input/BaseInput.vue'
import { formatWon, formatRecordMonth } from '@/shared/utils/formatter'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // homeStore.currentSavingRecord 그대로 { recordYm, targetSaving, actualSaving, recorded, differenceAmount }
  record: { type: Object, required: true },
  isSubmitting: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const inputValue = ref('')

// 팝업을 열 때마다 입력 상태를 다시 잡는다: 최초 입력이면 빈 값, 수정이면 기존 actualSaving을 채운다.
watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) return
    inputValue.value = props.record.recorded
      ? props.record.actualSaving.toLocaleString('ko-KR')
      : ''
  },
  { immediate: true },
)

function onInput(value) {
  const digits = String(value).replace(/\D/g, '')
  inputValue.value = digits ? Number(digits).toLocaleString('ko-KR') : ''
}

// 빈 입력과 0원을 구분해야 한다: 0원도 유효한 저축 기록이라 canSubmit에서 막으면 안 된다.
const amount = computed(() => {
  const digits = inputValue.value.replace(/\D/g, '')
  return digits === '' ? null : Number(digits)
})

const canSubmit = computed(() => amount.value !== null && amount.value >= 0 && !props.isSubmitting)

const monthLabel = computed(() => formatRecordMonth(props.record.recordYm))
const title = computed(
  () => `${monthLabel.value} 저축액 ${props.record.recorded ? '수정' : '기록'}`,
)
const submitLabel = computed(() =>
  props.isSubmitting ? '저장 중...' : props.record.recorded ? '수정하기' : '적용하기',
)

function close() {
  emit('update:modelValue', false)
}

function submit() {
  if (!canSubmit.value) return
  emit('submit', amount.value)
}
</script>

<template>
  <Transition name="monthly-saving-sheet">
    <div v-if="modelValue" class="monthly-saving-sheet-layer">
      <div class="monthly-saving-sheet-layer__backdrop" @click="close"></div>

      <section
        class="monthly-saving-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="monthly-saving-sheet-title"
      >
        <div class="monthly-saving-sheet__handle" aria-hidden="true"></div>

        <div class="monthly-saving-sheet__scroll">
          <h2 id="monthly-saving-sheet-title" class="monthly-saving-sheet__title">{{ title }}</h2>

          <div class="monthly-saving-sheet__field">
            <span class="monthly-saving-sheet__field-label">계획한 월 저축액</span>
            <strong class="monthly-saving-sheet__field-value">{{
              formatWon(record.targetSaving)
            }}</strong>
          </div>

          <p class="monthly-saving-sheet__section-label">이번 달 실제 저축액</p>
          <div class="monthly-saving-sheet__custom">
            <BaseInput
              class="monthly-saving-sheet__custom-input"
              :model-value="inputValue"
              type="text"
              inputmode="numeric"
              placeholder="금액을 입력하세요"
              @update:model-value="onInput"
            />
            <span class="monthly-saving-sheet__custom-unit">원</span>
          </div>
        </div>

        <div class="monthly-saving-sheet__actions">
          <BaseButton variant="secondary" :disabled="isSubmitting" @click="close">취소</BaseButton>
          <BaseButton variant="primary" :disabled="!canSubmit" @click="submit">
            {{ submitLabel }}
          </BaseButton>
        </div>
      </section>
    </div>
  </Transition>
</template>

<style scoped>
/*
  `월 저축 계획 수정`(MonthlySavingEditModal) 시트와 같은 구조/수치를 그대로 재사용해
  프로젝트 안에서 바텀시트가 하나의 패턴으로 보이게 한다.
*/
.monthly-saving-sheet-layer {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.monthly-saving-sheet-layer__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
}

.monthly-saving-sheet-enter-active,
.monthly-saving-sheet-leave-active {
  transition: opacity 0.22s ease;
}

.monthly-saving-sheet-enter-active .monthly-saving-sheet,
.monthly-saving-sheet-leave-active .monthly-saving-sheet {
  transition: transform 0.22s cubic-bezier(0.32, 0.72, 0, 1);
}

.monthly-saving-sheet-enter-from,
.monthly-saving-sheet-leave-to {
  opacity: 0;
}

.monthly-saving-sheet-enter-from .monthly-saving-sheet,
.monthly-saving-sheet-leave-to .monthly-saving-sheet {
  transform: translateY(100%);
}

.monthly-saving-sheet {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  max-height: min(85dvh, 640px);
  padding: 10px 16px calc(16px + env(safe-area-inset-bottom, 0px));
  border-radius: 24px 24px 0 0;
  background: var(--color-surface, #ffffff);
  color: var(--color-text-primary, #10130f);
  line-height: 1.45;
  box-shadow: 0 -12px 32px rgba(16, 19, 15, 0.12);
}

.monthly-saving-sheet__handle {
  flex: none;
  width: 36px;
  height: 4px;
  margin: 0 auto 14px;
  border-radius: 999px;
  background: var(--color-border, #e3e7e0);
}

.monthly-saving-sheet__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.monthly-saving-sheet__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary, #10130f);
  text-align: left;
}

.monthly-saving-sheet__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  border-radius: 14px;
  background: var(--color-app-bg, #f7f8f4);
}

.monthly-saving-sheet__field-label {
  color: var(--color-text-tertiary, #8f968c);
  font-size: 11px;
}

.monthly-saving-sheet__field-value {
  color: var(--color-primary, #1d6b3f);
  font-size: 16px;
  font-weight: 700;
}

.monthly-saving-sheet__section-label {
  margin: 14px 0 8px;
  color: var(--color-text-tertiary, #8f968c);
  font-size: 13px;
}

.monthly-saving-sheet__custom {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border-radius: 14px;
  background: var(--color-app-bg, #f7f8f4);
}

.monthly-saving-sheet :deep(.monthly-saving-sheet__custom-input) {
  border: none;
  background: transparent;
  color: var(--color-text-primary, #10130f);
  font-size: 14px;
  padding: 14px 0;
}

.monthly-saving-sheet :deep(.monthly-saving-sheet__custom-input):focus {
  outline: none;
}

.monthly-saving-sheet__custom-unit {
  flex-shrink: 0;
  color: var(--color-text-tertiary, #8f968c);
  font-size: 13px;
}

.monthly-saving-sheet__actions {
  flex: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border, #e3e7e0);
}

.monthly-saving-sheet__actions :deep(.base-button--secondary) {
  border: 1px solid var(--color-border, #e3e7e0);
  background: var(--color-app-bg, #f7f8f4);
  color: var(--color-text-primary, #10130f);
}

.monthly-saving-sheet__actions :deep(.base-button--primary) {
  background: var(--color-primary, #1d6b3f);
  color: #ffffff;
}
</style>
