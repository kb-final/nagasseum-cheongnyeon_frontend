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

    다크는 원래 색을 그대로 둔다(민트·골드).
    라이트만 main.css의 공용 테마 토큰에 붙인다. main.css는 건드리지 않는다.
  */
  --c-bg: #111111;
  --c-card: #171b16;
  --c-line: #334234;
  --c-ink: #e8f0e6;
  --c-ink-muted: #7fa398;
  --c-ink-faint: #7fa398;
  --c-accent: #9fd8ab;
  --c-accent-mid: #4f7a5c;
  --c-accent-soft: #263029;
  --c-slot: #263029;
  /* 금액은 다크에서만 금색. 라이트에서는 굵은 검정이 더 잘 읽힌다. */
  --c-value: #ffd939;
  --c-on-accent: #16281c;
  --c-danger: #e2735f;
  --c-danger-soft: #1e1512;
  --c-danger-line: #5c2f28;
  --c-danger-slot: #2b1a15;
  /* 총자산 카드만 배경색이 따로 있다. */
  --c-hero-bg: #f7ffd1;
  --c-hero-line: #f7ffd1;
  --c-hero-ink: #12281c;
  --c-hero-muted: #8a8f63;
  --c-hero-btn-bg: #12281c;
  --c-hero-btn-ink: #f7ffd1;
  /*
    AppHeader가 쓰는 legacy 변수. 이 화면에서만 테마 토큰으로 바꿔 끼운다.
  */
  --text-h: var(--color-text-primary);

  /*
    앱 배경이 아직 테마를 따라가지 않아 이 화면만 직접 칠한다. MobileLayout의
    여백(16px 16px 96px)을 음수 마진으로 상쇄한 뒤 같은 값을 다시 준다.
  */
  margin: -16px -16px -96px;
  padding: 16px 16px 110px;
  background: var(--c-bg);

  display: flex;
  flex-direction: column;
  gap: 14px;
}

:root[data-theme='light'] .asset-detail-view {
  --c-bg: var(--color-app-bg);
  --c-card: var(--color-surface);
  --c-line: var(--color-border);
  --c-ink: var(--color-text-primary);
  /*
    카드 설명 글 색. 디자인에서 지정한 값이라 공용 토큰 대신 직접 쓴다.
    흰 카드에서 6.2:1, 앱 배경에서 5.8:1로 기준(4.5:1)을 넘는다. 비교 화면과 같은 값.
  */
  --c-ink-muted: #5b6358;
  /*
    공용 --color-text-tertiary(#8f968c)는 흰 카드에서 3.04:1로 기준(4.5:1)에 못 미친다.
    여기 쓰이는 기관명이 10px라 더 불리해서 한 단계 진하게 쓴다. 비교 화면과 같은 값.
  */
  --c-ink-faint: #6f7a6d;
  --c-accent: var(--color-heading-accent);
  /*
    공용 --color-progress-inactive는 "게이지 빈 칸"용 회색(라이트 #e3e7e0)으로 바뀌었다.
    여기서 필요한 건 보조 막대·띠에 쓰는 중간 톤 초록이라 뜻이 달라서 값을 직접 쓴다.
  */
  --c-accent-mid: #a9c9b0;
  --c-accent-soft: #e8f4ea;
  --c-slot: #1d6b3f;
  --c-value: var(--color-text-primary);
  --c-on-accent: #ffffff;
  --c-danger: #c1442e;
  --c-danger-soft: #fdeeea;
  --c-danger-line: #f2cec5;
  --c-danger-slot: #7a2c1e;
  --c-hero-bg: #e8f4ea;
  --c-hero-line: #a9c9b0;
  --c-hero-ink: var(--color-text-primary);
  --c-hero-muted: var(--color-text-secondary);
  --c-hero-btn-bg: var(--color-heading-accent);
  --c-hero-btn-ink: #ffffff;
}

/*
  AppHeader는 공용 컴포넌트라 파일을 고치지 않는다. 제목이 font-weight 400이라
  화면에서 제일 큰 글자인데도 얇게 보여서 이 화면에서만 굵기를 덮는다.
*/
.asset-detail-view :deep(.app-header__title) {
  font-weight: 700;
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
  font-size: 11px;
  line-height: 1.5;
}
</style>
