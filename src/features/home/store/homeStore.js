import { ref } from 'vue'
import { defineStore } from 'pinia'

import {
  fetchActiveGoal,
  fetchGoalSummary,
  fetchHomeSummary,
  fetchRecommendedPolicies,
  fetchAssetBreakdown,
} from '@/features/home/api/homeApi'

export const useHomeStore = defineStore('home', () => {
  const summary = ref(null)
  const recommendedPolicies = ref([])
  const assetBreakdown = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  async function loadSummary() {
    isLoading.value = true
    error.value = null

    try {
      const activeGoal = await fetchActiveGoal()
      // recommendedPolicies/assetBreakdown은 목표 존재 여부와 무관하게 조회 가능
      const [goalSummary, policies, breakdown] = await Promise.all([
        activeGoal ? fetchGoalSummary(activeGoal.id) : fetchHomeSummary(),
        fetchRecommendedPolicies(),
        fetchAssetBreakdown(),
      ])

      summary.value = goalSummary
      recommendedPolicies.value = policies
      assetBreakdown.value = breakdown
    } catch (e) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  return { summary, recommendedPolicies, assetBreakdown, isLoading, error, loadSummary }
})
