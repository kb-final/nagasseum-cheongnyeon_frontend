<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import BaseSkeleton from '@/shared/components/atoms/feedback/Skeleton/BaseSkeleton.vue'

import { useHomeStore } from '@/features/home/store/homeStore'
import { useMemberStore } from '@/features/member/store/memberStore'
import { useAssetStore, FLOW_CONTEXT } from '@/features/asset'
import { useHomeEntranceAnimation } from '@/features/home/composables/useHomeEntranceAnimation'
import GreetingHeader from '@/features/home/components/GreetingHeader.vue'
import ClimbProgressCard from '@/features/home/components/ClimbProgressCard.vue'
import ActiveGoalCard from '@/features/home/components/ActiveGoalCard.vue'
import TotalAssetCard from '@/features/home/components/TotalAssetCard.vue'
import AssetSummaryGrid from '@/features/home/components/AssetSummaryGrid.vue'
import EmptyAssetCard from '@/features/home/components/EmptyAssetCard.vue'

const homeStore = useHomeStore()
const memberStore = useMemberStore()
const assetStore = useAssetStore()
const router = useRouter()

// 이번 세션에서 홈에 처음 들어왔을 때만 카드가 순서대로 떠오르는 진입 모션을 재생한다.
const shouldAnimate = useHomeEntranceAnimation()

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
  <div class="home-summary-view" :class="{ 'home-summary-view--animated': shouldAnimate }">
    <template v-if="homeStore.loaded">
      <GreetingHeader :member="member" />

      <!--
        목표가 없어도 같은 카드를 그린다. 캐릭터만 출발점에 서고 아래 요약이 안내로 바뀐다.
        목표를 세우면 이 산을 오르게 된다는 걸 그림으로 보여주려는 것이다.
        (기존 EmptyGoalCard는 이 화면에서 더 쓰지 않는다)
      -->
      <ClimbProgressCard
        :climb="homeStore.climb"
        :goal="homeStore.goal"
        @create-goal="router.push('/diagnosis')"
      />

      <ActiveGoalCard v-if="homeStore.goal" :goal="homeStore.goal" :climb="homeStore.climb" />

      <div v-if="homeStore.assetSummary" class="home-summary-view__asset-group">
        <TotalAssetCard
          :asset-summary="homeStore.assetSummary"
          @refresh="homeStore.loadSummary"
          @view-detail="router.push({ name: 'asset-detail' })"
        />
        <AssetSummaryGrid
          :asset-summary="homeStore.assetSummary"
          :asset-breakdown="homeStore.assetBreakdown"
        />
      </div>
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
  gap: 20px;
  padding-bottom: 24px;
}

.home-summary-view__skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/*
  세션 최초 진입 때만 카드가 위에서부터 순서대로 살짝 떠오르며 나타나게 한다.
  card-rise는 main.css에 공용으로 정의된 페이드+rise 모션(비교 화면 카드들도 같이 쓴다).
  자식 컴포넌트 루트가 부모(this) scope 속성을 같이 갖기 때문에 :deep() 없이도 닿는다.
*/
.home-summary-view--animated > * {
  animation: card-rise 0.35s ease-out both;
}

.home-summary-view--animated > *:nth-child(2) {
  animation-delay: 0.06s;
}

.home-summary-view--animated > *:nth-child(3) {
  animation-delay: 0.12s;
}

.home-summary-view--animated > *:nth-child(4) {
  animation-delay: 0.18s;
}

/* 총 자산과 미니 자산 카드는 같은 "자산 요약" 그룹이라 서로 더 붙어 보이도록
   바깥 섹션 간격(20px)보다 좁게 준다. */
.home-summary-view__asset-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
