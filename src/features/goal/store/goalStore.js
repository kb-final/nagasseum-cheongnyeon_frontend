import { ref } from 'vue'
import { defineStore } from 'pinia'

import { postGoalDiagnosis } from '@/features/goal/api/goalApi'

export const useGoalStore = defineStore('goal', () => {
  const diagnosisResult = ref(null) // 진단 결과(달성 가능한 목표 옵션 배열)
  const isSubmitting = ref(false)
  const error = ref(null)

  async function submitDiagnosis(payload) {
    isSubmitting.value = true
    error.value = null

    try {
      diagnosisResult.value = await postGoalDiagnosis(payload)
    } catch (e) {
      error.value = e
    } finally {
      isSubmitting.value = false
    }
  }

  return { diagnosisResult, isSubmitting, error, submitDiagnosis }
})
