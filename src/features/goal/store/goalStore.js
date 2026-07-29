import { ref } from 'vue'
import { defineStore } from 'pinia'

import { postGoalDiagnosis, postGoal } from '@/features/goal/api/goalApi'

export const useGoalStore = defineStore('goal', () => {
  const diagnosisResult = ref(null) // 진단 결과 { budget, results }
  const isSubmitting = ref(false)
  const error = ref(null)

  const isSaving = ref(false)
  const saveError = ref(null)

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

  async function saveGoal(payload) {
    isSaving.value = true
    saveError.value = null

    try {
      return await postGoal(payload)
    } catch (e) {
      saveError.value = e
      return null
    } finally {
      isSaving.value = false
    }
  }

  return {
    diagnosisResult,
    isSubmitting,
    error,
    submitDiagnosis,
    isSaving,
    saveError,
    saveGoal,
  }
})
