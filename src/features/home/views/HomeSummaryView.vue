<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import BaseSkeleton from '@/shared/components/atoms/feedback/Skeleton/BaseSkeleton.vue'

import { useHomeStore } from '@/features/home/store/homeStore'
import GreetingHeader from '@/features/home/components/GreetingHeader.vue'
import ClimbProgressCard from '@/features/home/components/ClimbProgressCard.vue'
import EmptyGoalCard from '@/features/home/components/EmptyGoalCard.vue'
import TotalAssetCard from '@/features/home/components/TotalAssetCard.vue'
import AssetSummaryGrid from '@/features/home/components/AssetSummaryGrid.vue'
import RecommendedPolicyList from '@/features/home/components/RecommendedPolicyList.vue'
import MarketPriceAlertCard from '@/features/home/components/MarketPriceAlertCard.vue'

const homeStore = useHomeStore()
const router = useRouter()

onMounted(() => {
  if (!homeStore.summary) homeStore.loadSummary()
})
</script>

<template>
  <div class="home-summary-view">
    <template v-if="homeStore.summary">
      <GreetingHeader :member="homeStore.summary.member" />
      <ClimbProgressCard
        v-if="homeStore.summary.goal"
        :climb="homeStore.summary.climb"
        :goal="homeStore.summary.goal"
        @view-goal="router.push(`/goals/${homeStore.summary.goal.id}`)"
      />
      <EmptyGoalCard v-else @create-goal="router.push('/diagnosis')" />
      <TotalAssetCard
        :asset-summary="homeStore.summary.assetSummary"
        @refresh="homeStore.loadSummary"
      />
      <AssetSummaryGrid
        :asset-summary="homeStore.summary.assetSummary"
        :asset-breakdown="homeStore.assetBreakdown"
      />
      <RecommendedPolicyList
        :policies="homeStore.recommendedPolicies"
        @view-all="router.push('/policy')"
      />
      <MarketPriceAlertCard
        :market-alert="homeStore.summary.marketAlert"
        @edit-goal="router.push('/goal')"
      />
    </template>

    <div v-else-if="homeStore.isLoading" class="home-summary-view__skeleton">
      <BaseSkeleton height="180px" radius="16px" />
      <BaseSkeleton height="120px" radius="16px" />
      <BaseSkeleton height="80px" radius="16px" />
    </div>

    <p v-else-if="homeStore.error" class="home-summary-view__error">데이터를 불러오지 못했어요.</p>
  </div>
</template>

<style scoped>
.home-summary-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.home-summary-view__skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.home-summary-view__error {
  padding: 24px 0;
  color: var(--text, #9aa09a);
  text-align: center;
}
</style>
