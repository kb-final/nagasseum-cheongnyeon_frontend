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
      <BaseSkeleton height="140px" radius="14px" />
      <BaseSkeleton height="220px" radius="14px" />
      <BaseSkeleton height="220px" radius="14px" />
    </div>

    <p v-else-if="assetStore.detailError" class="asset-detail-view__error">
      자산 정보를 불러오지 못했어요.
    </p>
  </div>
</template>

<style scoped>
.asset-detail-view {
  /*
    자산 인벤토리 색. 비교 화면과 같은 이름을 쓴다.
    다크로 되돌릴 땐 이 표의 값만 바꾸면 되고 자식 컴포넌트는 손댈 것이 없다.
    (어두운 값은 이 파일 맨 아래 주석에 적어뒀다)
  */
  --c-bg: #f7f8f4;
  --c-card: #ffffff;
  --c-line: #e3e7df;
  --c-ink: #10130f;
  --c-ink-muted: #5b6358;
  --c-ink-faint: #8f968c;
  --c-accent: #1d6b3f;
  --c-accent-mid: #a9c9b0;
  --c-accent-soft: #e8f4ea;
  --c-slot: #1d6b3f;
  --c-danger: #c1442e;
  --c-danger-soft: #fdeeea;
  --c-danger-line: #f2cec5;
  --c-danger-slot: #7a2c1e;

  /*
    AppHeader는 공용 컴포넌트라 파일을 고치지 않는다. 제목과 뒤로가기 화살표가
    var(--text-h, #ffffff)를 쓰고 있어서, 이 화면에서만 그 변수를 덮어쓴다.
  */
  --text-h: var(--c-ink);

  /*
    앱 배경(--bg)이 아직 어두워서 이 화면만 밝게 덮는다.
    MobileLayout의 여백(16px 16px 96px)을 음수 마진으로 상쇄한 뒤 같은 값을 다시 준다.
    앱 전체가 라이트로 바뀌면 이 세 줄은 지우면 된다.
  */
  margin: -16px -16px -96px;
  padding: 16px 16px 96px;
  background: var(--c-bg);

  display: flex;
  flex-direction: column;
  gap: 14px;
}

.asset-detail-view__skeleton {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.asset-detail-view__error {
  padding: 24px 0;
  color: var(--c-ink-muted);
  text-align: center;
}

.asset-detail-view__sync-error {
  margin: 0;
  padding: 9px 12px;
  border: 1px solid var(--c-danger-line);
  border-radius: 10px;
  background: var(--c-danger-soft);
  color: var(--c-danger);
  font-size: 11.5px;
  line-height: 1.5;
}

/*
  다크로 되돌릴 때 쓰는 값.

  --c-bg: #111111;          --c-card: #171b16;        --c-line: #334234;
  --c-ink: #e8f0e6;         --c-ink-muted: #7fa398;   --c-ink-faint: #7f8a7d;
  --c-accent: #9fd8ab;      --c-accent-mid: #4f7a5c;  --c-accent-soft: #263029;
  --c-slot: #263029;
  --c-danger: #e2735f;      --c-danger-soft: #1e1512; --c-danger-line: #5c2f28;
  --c-danger-slot: #2b1a15;

  --text-h 덮어쓰기와 배경 블리드 세 줄(margin/padding/background)도 함께 지운다.
*/
</style>
