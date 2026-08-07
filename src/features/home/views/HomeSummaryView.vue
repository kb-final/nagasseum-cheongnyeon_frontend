<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import BaseSkeleton from '@/shared/components/atoms/feedback/Skeleton/BaseSkeleton.vue'

import { useHomeStore } from '@/features/home/store/homeStore'
import { useMemberStore } from '@/features/member/store/memberStore'
import { useAssetStore, FLOW_CONTEXT } from '@/features/asset'
import GreetingHeader from '@/features/home/components/GreetingHeader.vue'
import ClimbProgressCard from '@/features/home/components/ClimbProgressCard.vue'
import TotalAssetCard from '@/features/home/components/TotalAssetCard.vue'
import AssetSummaryGrid from '@/features/home/components/AssetSummaryGrid.vue'
import EmptyAssetCard from '@/features/home/components/EmptyAssetCard.vue'

const homeStore = useHomeStore()
const memberStore = useMemberStore()
const assetStore = useAssetStore()
const router = useRouter()

const member = computed(() => ({
  ...homeStore.member,
  nickname: memberStore.profile?.nickname ?? homeStore.member.nickname,
}))

// 홈 화면에 들어올 때마다(목표 저장/자산 연동 등 다른 화면에서 상태가 바뀌고 돌아오는 경우 포함)
// 항상 최신 데이터를 다시 불러온다. loaded는 최초 스켈레톤 노출 여부 구분용으로만 쓰인다.
onMounted(() => {
  homeStore.loadSummary()
  // 프로필은 자주 바뀌지 않는다. 마이페이지를 거쳐 왔다면 이미 채워져 있어 다시 부르지 않는다.
  if (!memberStore.profile) memberStore.fetchProfile()
})

function goToAssetLink() {
  assetStore.setFlowContext(FLOW_CONTEXT.ADDITIONAL)
  router.push({ name: 'asset-link' })
}
</script>

<template>
  <div class="home-summary-view">
    <template v-if="homeStore.loaded">
      <GreetingHeader :member="member" />

      <!--
        목표가 없어도 같은 카드를 그린다. 캐릭터만 출발점에 서고 아래 요약이 안내로 바뀐다.
      -->
      <ClimbProgressCard
        :climb="homeStore.climb"
        :goal="homeStore.goal"
        @view-goal="router.push(`/goals/${homeStore.goal.id}`)"
        @create-goal="router.push('/diagnosis')"
      />

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
