<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import BaseSkeleton from '@/shared/components/atoms/feedback/Skeleton/BaseSkeleton.vue'
import { useToast } from '@/shared/composables/useToast'
import { formatWon } from '@/shared/utils/formatter'

import { useHomeStore } from '@/features/home/store/homeStore'
import { useMemberStore } from '@/features/member/store/memberStore'
import { useAssetStore, FLOW_CONTEXT } from '@/features/asset'
import GreetingHeader from '@/features/home/components/GreetingHeader.vue'
import ClimbProgressCard from '@/features/home/components/ClimbProgressCard.vue'
import ActiveGoalCard from '@/features/home/components/ActiveGoalCard.vue'
import MonthlySavingCard from '@/features/home/components/MonthlySavingCard.vue'
import MonthlySavingModal from '@/features/home/components/MonthlySavingModal.vue'
import TotalAssetCard from '@/features/home/components/TotalAssetCard.vue'
import SyncingAssetCard from '@/features/home/components/SyncingAssetCard.vue'
import EmptyAssetCard from '@/features/home/components/EmptyAssetCard.vue'

const homeStore = useHomeStore()
const memberStore = useMemberStore()
const assetStore = useAssetStore()
const router = useRouter()
const toast = useToast()

const member = computed(() => ({
  ...homeStore.member,
  nickname: memberStore.profile?.nickname ?? homeStore.member.nickname,
}))

// 마이데이터 동기화는 서버에서 잡 기반 비동기로 처리되고, 온보딩 화면은 완료를 기다리지
// 않고 홈으로 넘어온다. 홈에 머무는 동안 동기화가 끝나면 자산 요약을 다시 불러와서
// 새로고침해야만 자산이 보이던 문제를 없앤다.
const isRefreshingAssetSummary = ref(false)

watch(
  () => assetStore.isSyncing,
  async (isSyncing, wasSyncing) => {
    if (!wasSyncing || isSyncing || assetStore.syncError) return
    isRefreshingAssetSummary.value = true
    await homeStore.loadSummary()
    isRefreshingAssetSummary.value = false
  },
)

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

const isSavingModalOpen = ref(false)

// 입력하기/수정 버튼 모두 같은 시트를 연다 — 시트 안에서 homeStore.currentSavingRecord.recorded로
// 최초 입력인지 수정인지 판단해 문구만 바꾼다.
function openSavingModal() {
  isSavingModalOpen.value = true
}

// PUT 응답으로 store가 이미 갱신되므로 홈 데이터를 다시 조회하지 않고 시트만 닫는다.
async function onSubmitSaving(actualSaving) {
  const saved = await homeStore.saveCurrentSaving(actualSaving)
  if (!saved) {
    toast.show('저축액 저장에 실패했어요. 다시 시도해주세요.', { type: 'error', position: 'top' })
    return
  }

  isSavingModalOpen.value = false
  toast.show(`이번 달 저축액을 ${formatWon(actualSaving)}으로 저장했어요.`, {
    type: 'success',
    position: 'top',
  })
}
</script>

<template>
  <div class="home-summary-view home-summary-view--animated">
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

      <ActiveGoalCard
        v-if="homeStore.goal"
        :goal="homeStore.goal"
        :market-insight="homeStore.marketInsight"
      />

      <!-- ACTIVE 목표가 있을 때만 노출한다 — 저축 기록은 목표의 월 저축 계획(targetSaving)을
           기준으로 비교하므로 목표가 없으면 비교 대상 자체가 없다. -->
      <MonthlySavingCard
        v-if="homeStore.goal"
        :record="homeStore.currentSavingRecord"
        @open="openSavingModal"
      />

      <TotalAssetCard
        v-if="homeStore.assetSummary"
        :asset-summary="homeStore.assetSummary"
        :asset-breakdown="homeStore.assetBreakdown"
        @refresh="homeStore.loadSummary"
        @view-detail="router.push({ name: 'asset-detail' })"
      />
      <SyncingAssetCard v-else-if="assetStore.isSyncing || isRefreshingAssetSummary" />
      <EmptyAssetCard
        v-else
        :error-message="assetStore.syncError?.message ?? ''"
        @link-asset="goToAssetLink"
      />
    </template>

    <div v-else-if="homeStore.isLoading" class="home-summary-view__skeleton">
      <BaseSkeleton height="180px" radius="16px" />
      <BaseSkeleton height="120px" radius="16px" />
      <BaseSkeleton height="80px" radius="16px" />
    </div>

    <MonthlySavingModal
      v-model="isSavingModalOpen"
      :record="homeStore.currentSavingRecord"
      :is-submitting="homeStore.isSavingCurrentSaving"
      @submit="onSubmitSaving"
    />
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
  카드가 위에서부터 순서대로 살짝 떠오르며 나타나게 한다.
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
</style>
