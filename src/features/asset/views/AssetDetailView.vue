<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/shared/components/molecules/AppHeader.vue'
import BaseSkeleton from '@/shared/components/atoms/feedback/Skeleton/BaseSkeleton.vue'
import { AuthSessionMissingError } from '@/shared/utils/authSession'

import AssetTotalCard from '@/features/asset/components/AssetTotalCard.vue'
import AssetCategorySection from '@/features/asset/components/AssetCategorySection.vue'
import AssetAccountCard from '@/features/asset/components/AssetAccountCard.vue'
import { useAssetStore } from '@/features/asset/store/assetStore'

const router = useRouter()
const assetStore = useAssetStore()

const isSessionMissing = computed(() => assetStore.detailError instanceof AuthSessionMissingError)

onMounted(() => {
  if (!assetStore.assetDetail) assetStore.fetchAssetDetail()
})
</script>

<template>
  <div class="asset-detail-view">
    <AppHeader title="내 자산" @back="router.back()" />

    <template v-if="assetStore.assetDetail">
      <AssetTotalCard
        :total-assets="assetStore.assetDetail.totalAssets"
        :synced-at="assetStore.assetDetail.syncedAt"
        :is-refreshing="assetStore.isSyncing"
        @refresh="assetStore.syncAndRefreshAssetDetail"
      />

      <AssetCategorySection
        v-for="category in assetStore.assetDetail.categories"
        :key="category.type"
        :label="category.label"
        :total-amount="category.totalAmount"
        :accounts="category.accounts"
      />

      <section
        v-if="assetStore.assetDetail.manualAssets.length > 0"
        class="asset-detail-view__manual"
      >
        <span class="asset-detail-view__manual-label">직접 등록한 자산</span>
        <div class="asset-detail-view__manual-list">
          <AssetAccountCard
            v-for="asset in assetStore.assetDetail.manualAssets"
            :key="asset.id"
            :account="asset"
          />
        </div>
      </section>

      <section class="asset-detail-view__loans">
        <span class="asset-detail-view__loans-label">대출</span>
        <div class="asset-detail-view__loans-list">
          <AssetAccountCard
            v-for="loan in assetStore.assetDetail.loans"
            :key="loan.id"
            :account="loan"
          />
          <p
            v-if="assetStore.assetDetail.loans.length === 0"
            class="asset-detail-view__loans-empty"
          >
            보유 중인 대출이 없어요
          </p>
        </div>
      </section>
    </template>

    <div v-else-if="assetStore.isLoadingDetail" class="asset-detail-view__skeleton">
      <BaseSkeleton height="140px" radius="16px" />
      <BaseSkeleton height="150px" radius="16px" />
      <BaseSkeleton height="220px" radius="16px" />
    </div>

    <p v-else-if="assetStore.detailError" class="asset-detail-view__error">
      {{ isSessionMissing ? '로그인이 필요해요.' : '자산 정보를 불러오지 못했어요.' }}
    </p>
  </div>
</template>

<style scoped>
.asset-detail-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.asset-detail-view__manual,
.asset-detail-view__loans {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.asset-detail-view__manual-label {
  padding: 0 2px;
  font-size: 13px;
  color: #7fa398;
}

.asset-detail-view__manual-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.asset-detail-view__loans-label {
  padding: 0 2px;
  font-size: 13px;
  color: #7fa398;
}

.asset-detail-view__loans-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.asset-detail-view__loans-empty {
  margin: 0;
  padding: 24px 0;
  border: 1px solid var(--border, #262626);
  border-radius: 16px;
  color: #888888;
  font-size: 13px;
  text-align: center;
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
</style>
