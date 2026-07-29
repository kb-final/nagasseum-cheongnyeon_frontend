<script setup>
import { useRouter } from 'vue-router'

import AppHeader from '@/shared/components/molecules/AppHeader.vue'

import HousingGoalDiagnosisForm from '@/features/goal/components/HousingGoalDiagnosisForm.vue'
import { useGoalStore } from '@/features/goal/store/goalStore'

const router = useRouter()
const goalStore = useGoalStore()

function onSubmitted() {
  // TODO(후속 작업): 진단 결과 옵션 목록 화면이 만들어지면 해당 라우트로 이동시킨다.
  // 결과 화면 전까지는 store에 담긴 diagnosisResult를 콘솔로 확인한다.
  console.log('진단 결과:', goalStore.diagnosisResult)
}
</script>

<template>
  <div class="diagnosis-view">
    <AppHeader title="목표 진단하기" @back="router.back()" />
    <div class="diagnosis-view__content">
      <HousingGoalDiagnosisForm @submitted="onSubmitted" />
      <p v-if="goalStore.error" class="diagnosis-view__error">진단 결과를 불러오지 못했어요.</p>
    </div>
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
