<script setup>
import { reactive, computed } from 'vue'

import BaseChipGroup from '@/shared/components/atoms/form/ChipGroup/BaseChipGroup.vue'
import BaseDualRangeSlider from '@/shared/components/atoms/form/RangeSlider/BaseDualRangeSlider.vue'
import BaseYearMonthSelect from '@/shared/components/atoms/form/YearMonthSelect/BaseYearMonthSelect.vue'
import BaseInputField from '@/shared/components/molecules/BaseInputField.vue'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import { formatEok, formatManwon } from '@/shared/utils/formatter'

import RegionSelect from '@/features/goal/components/RegionSelect.vue'
import { useGoalStore } from '@/features/goal/store/goalStore'

// 백엔드에 housingType/dealType enum이 아직 없음(String 컬럼, DB 코멘트가 한글 그대로 표기) —
// 확정 코드가 생기기 전까지 한글 표시값을 그대로 값으로 사용한다.
const HOUSING_TYPE_OPTIONS = [
  { label: '아파트', value: '아파트' },
  { label: '오피스텔', value: '오피스텔' },
  { label: '연립·다세대', value: '연립다세대' },
  { label: '단독·다가구', value: '단독다가구' },
]

const DEAL_TYPE_OPTIONS = [
  { label: '전세', value: '전세' },
  { label: '월세', value: '월세' },
]

const form = reactive({
  region: null,
  housingType: '오피스텔',
  dealType: '월세',
  area: { min: 10, max: 20 },
  deposit: { min: 300000000, max: 600000000 },
  monthlyRent: { min: 300000, max: 800000 },
  monthlySaving: '',
  targetDate: '', // BaseYearMonthSelect가 마운트 시 다음 달로 자동 보정한다
})

const emit = defineEmits(['submitted'])

const goalStore = useGoalStore()

const isMonthlyRent = computed(() => form.dealType === '월세')

function formatPyeong(value) {
  return `${value}평`
}

async function onSubmit() {
  const payload = {
    // UI는 지역 단일 선택이지만, 백엔드 계약(goalHousing.regions: 지역 코드 배열)에 맞춰 배열로 감싼다
    regions: form.region ? [form.region] : [],
    housingType: form.housingType,
    dealType: form.dealType,
    areaMin: form.area.min,
    areaMax: form.area.max,
    depositMin: form.deposit.min,
    depositMax: form.deposit.max,
    monthlyRentMin: isMonthlyRent.value ? form.monthlyRent.min : null,
    monthlyRentMax: isMonthlyRent.value ? form.monthlyRent.max : null,
    monthlySaving: Number(form.monthlySaving),
    targetDate: form.targetDate,
  }

  await goalStore.submitDiagnosis(payload)
  emit('submitted')
}
</script>

<template>
  <form class="diagnosis-form" @submit.prevent="onSubmit">
    <RegionSelect v-model="form.region" />

    <BaseChipGroup
      v-model="form.housingType"
      label="주거 형태"
      :options="HOUSING_TYPE_OPTIONS"
      size="sm"
    />

    <BaseChipGroup
      v-model="form.dealType"
      label="거래 유형"
      :options="DEAL_TYPE_OPTIONS"
      size="sm"
    />

    <BaseDualRangeSlider
      v-model="form.area"
      label="희망 평수 (범위)"
      :min="0"
      :max="50"
      :step="1"
      :format-value="formatPyeong"
    />

    <BaseDualRangeSlider
      v-model="form.deposit"
      label="희망 보증금 (범위)"
      :min="0"
      :max="1000000000"
      :step="10000000"
      :format-value="formatEok"
    />

    <BaseDualRangeSlider
      v-if="isMonthlyRent"
      v-model="form.monthlyRent"
      label="희망 월세 (범위)"
      :min="0"
      :max="2000000"
      :step="100000"
      :format-value="formatManwon"
    />

    <BaseInputField v-model="form.monthlySaving" label="월 저축액" type="number" placeholder="0">
      <template #suffix>
        <span class="diagnosis-form__suffix">원</span>
      </template>
    </BaseInputField>

    <BaseYearMonthSelect v-model="form.targetDate" label="목표 시점" />

    <BaseButton
      class="diagnosis-form__submit"
      type="submit"
      variant="primary"
      size="lg"
      :disabled="goalStore.isSubmitting"
    >
      진단하기
    </BaseButton>
  </form>
</template>

<style scoped>
.diagnosis-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.diagnosis-form__suffix {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  color: var(--text, #9aa09a);
  font-size: 14px;
  pointer-events: none;
}

/* BaseButton의 공용 primary 색상(다른 화면과 공유)과 별개로 이 화면의 제출 버튼만 색을 지정한다 */
:deep(.diagnosis-form__submit.base-button--primary) {
  background: #c1e8c8;
}
</style>
