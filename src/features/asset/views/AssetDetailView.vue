<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/shared/components/molecules/AppHeader.vue'
import BaseSkeleton from '@/shared/components/atoms/feedback/Skeleton/BaseSkeleton.vue'

import AssetTotalCard from '@/features/asset/components/AssetTotalCard.vue'
import AssetInventoryGrid from '@/features/asset/components/AssetInventoryGrid.vue'
import AssetDebtBanner from '@/features/asset/components/AssetDebtBanner.vue'
import { useAssetStore } from '@/features/asset/store/assetStore'

const router = useRouter()
const assetStore = useAssetStore()

onMounted(() => {
  if (!assetStore.assetDetail) assetStore.fetchAssetDetail()
})
</script>

<template>
  <div class="asset-detail-view">
    <AppHeader title="자산 인벤토리" @back="router.back()" />

    <template v-if="assetStore.assetDetail">
      <AssetTotalCard
        :total-assets="assetStore.assetDetail.totalAssets"
        :synced-at="assetStore.assetDetail.syncedAt"
        :is-refreshing="assetStore.isSyncing"
        @refresh="assetStore.runAssetSync"
      />

      <p v-if="assetStore.syncError" class="asset-detail-view__sync-error">
        {{ assetStore.syncError.message }}
      </p>

      <AssetInventoryGrid
        :institutions="assetStore.assetDetail.institutions"
        :manual-assets="assetStore.assetDetail.manualAssets"
      />

      <AssetDebtBanner :loans="assetStore.assetDetail.loans" />
    </template>

    <div v-else-if="assetStore.isLoadingDetail" class="asset-detail-view__skeleton">
      <BaseSkeleton height="140px" radius="16px" />
      <BaseSkeleton height="220px" radius="16px" />
      <BaseSkeleton height="220px" radius="16px" />
    </div>

    <p v-else-if="assetStore.detailError" class="asset-detail-view__error">
      자산 정보를 불러오지 못했어요.
    </p>
  </div>
</template>

<style scoped>
.asset-detail-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 24px;
}

.asset-detail-view__skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.asset-detail-view__error {
  padding: 24px 0;
  color: var(--text, #9aa09a);
  text-align: center;
}

.asset-detail-view__sync-error {
  margin: 0;
  padding: 9px 12px;
  border: 1px solid #5c2f28;
  background: #1e1512;
  color: #e2735f;
  font-size: 11.5px;
  line-height: 1.5;
}
</style>
