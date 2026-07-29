<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/shared/components/molecules/AppHeader.vue'

import HousingGoalDiagnosisForm from '@/features/goal/components/HousingGoalDiagnosisForm.vue'
import DiagnosisResultModal from '@/features/goal/components/DiagnosisResultModal.vue'
import { useGoalStore } from '@/features/goal/store/goalStore'

const router = useRouter()
const goalStore = useGoalStore()

const isResultOpen = ref(false)
const conditionSummary = ref('')
const lastDiagnosisPayload = ref(null)

function onSubmitted({ conditionSummary: summary, payload }) {
  if (goalStore.error) return

  conditionSummary.value = summary
  lastDiagnosisPayload.value = payload
  isResultOpen.value = true
}

async function onConfirm() {
  // 목표 설정 시점 중앙값을 targetAmount/targetRentMiddleAmount로 함께 저장한다 (goal ERD 참고)
  const median = goalStore.diagnosisResult?.results?.[0]?.marketStats?.median
  const saved = await goalStore.saveGoal({
    ...lastDiagnosisPayload.value,
    targetAmount: median,
    targetRentMiddleAmount: median,
  })

  if (saved) {
    isResultOpen.value = false
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <div class="diagnosis-view">
    <AppHeader title="목표 진단하기" @back="router.back()" />
    <div class="diagnosis-view__content">
      <HousingGoalDiagnosisForm @submitted="onSubmitted" />
      <p v-if="goalStore.error" class="diagnosis-view__error">진단 결과를 불러오지 못했어요.</p>
    </div>

    <DiagnosisResultModal
      v-model="isResultOpen"
      :condition-summary="conditionSummary"
      :result="goalStore.diagnosisResult"
      @confirm="onConfirm"
    />
  </div>
</template>

<style scoped>
.diagnosis-view {
  display: flex;
  flex-direction: column;
}

.diagnosis-view__content {
  padding: 20px;
}

.diagnosis-view__error {
  margin-top: 16px;
  color: var(--color-point, #c1442e);
  text-align: center;
}
</style>
