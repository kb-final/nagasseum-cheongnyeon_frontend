import { ref } from 'vue'
import { defineStore } from 'pinia'

import {
  postGoalDiagnosis,
  postGoal,
  fetchGoalDetail,
  fetchGoal,
  putGoal,
} from '@/features/goal/api/goalApi'

export const useGoalStore = defineStore('goal', () => {
  const diagnosisResult = ref(null) // 진단 결과 { budget, results }
  const isSubmitting = ref(false)
  const error = ref(null)

  const isSaving = ref(false)
  const saveError = ref(null)

  const goalDetail = ref(null) // 목표 상세 조회 결과 { housing, progress, savingStatus, forecasts, ... }
  const isLoadingDetail = ref(false)
  const detailError = ref(null)

  const isUpdating = ref(false)
  const updateError = ref(null)

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

  async function loadGoalDetail(goalId) {
    isLoadingDetail.value = true
    detailError.value = null

    try {
      goalDetail.value = await fetchGoalDetail(goalId)
    } catch (e) {
      detailError.value = e
      goalDetail.value = null
    } finally {
      isLoadingDetail.value = false
    }
  }

  // 월 저축액만 바꾸는 화면이지만 목표 수정 API가 전체 교체(PUT)라, 기존 목표를 먼저 조회해
  // 나머지 필드(목표 금액/시점/주거 조건)를 그대로 실어 보낸다. 상세 조회 응답에는 지역 "코드"가
  // 없어서 detail 값만으로는 요청 본문을 만들 수 없다.
  async function updateMonthlySaving(goalId, monthlySaving) {
    isUpdating.value = true
    updateError.value = null

    try {
      const goal = await fetchGoal(goalId)
      await putGoal(goalId, {
        targetAmount: goal.targetAmount,
        targetDate: goal.targetDate,
        monthlySaving,
        housing: goal.housing,
      })
      return true
    } catch (e) {
      updateError.value = e
      return false
    } finally {
      isUpdating.value = false
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
    goalDetail,
    isLoadingDetail,
    detailError,
    loadGoalDetail,
    isUpdating,
    updateError,
    updateMonthlySaving,
  }
})
