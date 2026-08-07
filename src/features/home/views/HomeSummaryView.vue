<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import BaseSkeleton from '@/shared/components/atoms/feedback/Skeleton/BaseSkeleton.vue'

import { useHomeStore } from '@/features/home/store/homeStore'
import { useAssetStore, FLOW_CONTEXT } from '@/features/asset'
import GreetingHeader from '@/features/home/components/GreetingHeader.vue'
import ClimbProgressCard from '@/features/home/components/ClimbProgressCard.vue'
import EmptyGoalCard from '@/features/home/components/EmptyGoalCard.vue'
import TotalAssetCard from '@/features/home/components/TotalAssetCard.vue'
import AssetSummaryGrid from '@/features/home/components/AssetSummaryGrid.vue'
import EmptyAssetCard from '@/features/home/components/EmptyAssetCard.vue'

const homeStore = useHomeStore()
const assetStore = useAssetStore()
const router = useRouter()

// 홈 화면에 들어올 때마다(목표 저장/자산 연동 등 다른 화면에서 상태가 바뀌고 돌아오는 경우 포함)
// 항상 최신 데이터를 다시 불러온다. loaded는 최초 스켈레톤 노출 여부 구분용으로만 쓰인다.
onMounted(() => {
  homeStore.loadSummary()
})

function goToAssetLink() {
  assetStore.setFlowContext(FLOW_CONTEXT.ADDITIONAL)
  router.push({ name: 'asset-link' })
}
</script>

<template>
  <div class="home-summary-view">
    <template v-if="homeStore.loaded">
      <GreetingHeader :member="homeStore.member" />
      <ClimbProgressCard
        v-if="homeStore.goal"
        :climb="homeStore.climb"
        :goal="homeStore.goal"
        @view-goal="router.push(`/goals/${homeStore.goal.id}`)"
      />
      <EmptyGoalCard v-else @create-goal="router.push('/diagnosis')" />

      <template v-if="homeStore.assetSummary">
        <TotalAssetCard
          :asset-summary="homeStore.assetSummary"
          @refresh="homeStore.loadSummary"
          @view-detail="router.push({ name: 'asset-detail' })"
        />
        <AssetSummaryGrid
          :asset-summary="homeStore.assetSummary"
          :asset-breakdown="homeStore.assetBreakdown"
        />
      </template>
      <EmptyAssetCard v-else @link-asset="goToAssetLink" />
    </template>

    <div v-else-if="homeStore.isLoading" class="home-summary-view__skeleton">
      <BaseSkeleton height="180px" radius="16px" />
      <BaseSkeleton height="120px" radius="16px" />
      <BaseSkeleton height="80px" radius="16px" />
    </div>
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
</style>
