import { ref } from 'vue'
import { defineStore } from 'pinia'

import {
  postGoalDiagnosis,
  postGoal,
  fetchGoalDetail,
  fetchGoal,
  putGoal,
  fetchMonthlySavingSimulation,
} from '@/features/goal/api/goalApi'
import { useAuthStore } from '@/features/auth/store/authStore'

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

  // 직접 입력한 월 저축액의 예상 달성 시점. 상세 조회 forecasts[] 항목과 같은 형태다.
  const savingSimulation = ref(null)
  const isSimulating = ref(false)
  const simulationError = ref(null)
  // 입력할 때마다 호출되므로 응답이 역순으로 도착할 수 있다. 마지막 요청 결과만 반영한다.
  let latestSimulationId = 0

  async function submitDiagnosis(payload) {
    isSubmitting.value = true
    error.value = null

    try {
      const memberId = useAuthStore().user?.id
      diagnosisResult.value = await postGoalDiagnosis(memberId, payload)
    } catch (e) {
      // 백엔드가 {success:false, error:{code,message,fields}}로 내려주므로, 있으면 그 메시지를 그대로 쓴다.
      error.value = e.response?.data?.error ?? e
    } finally {
      isSubmitting.value = false
    }
  }

  async function saveGoal(payload) {
    isSaving.value = true
    saveError.value = null

    try {
      const memberId = useAuthStore().user?.id
      return await postGoal(memberId, payload)
    } catch (e) {
      saveError.value = e.response?.data?.error ?? e
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

  async function loadSavingSimulation(goalId, monthlySaving) {
    const requestId = ++latestSimulationId
    isSimulating.value = true
    simulationError.value = null

    try {
      const result = await fetchMonthlySavingSimulation(goalId, monthlySaving)
      if (requestId !== latestSimulationId) return
      savingSimulation.value = result
    } catch (e) {
      // 계산에 실패하면 이전 결과를 남겨두지 않는다 (틀린 날짜를 보여주는 것보다 안 보여주는 편이 낫다)
      if (requestId !== latestSimulationId) return
      savingSimulation.value = null
      simulationError.value = e
    } finally {
      if (requestId === latestSimulationId) isSimulating.value = false
    }
  }

  // 진행 중인 요청 결과까지 버린다 (추천 금액으로 되돌아가거나 팝업을 닫을 때)
  function clearSavingSimulation() {
    latestSimulationId += 1
    savingSimulation.value = null
    simulationError.value = null
    isSimulating.value = false
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
    savingSimulation,
    isSimulating,
    simulationError,
    loadSavingSimulation,
    clearSavingSimulation,
  }
})
