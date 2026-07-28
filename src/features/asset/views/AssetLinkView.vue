<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import BaseBreadcrumb from '@/shared/components/atoms/navigation/Breadcrumb/BaseBreadcrumb.vue'
import BaseSkeleton from '@/shared/components/atoms/feedback/Skeleton/BaseSkeleton.vue'
import AppHeader from '@/shared/components/molecules/AppHeader.vue'
import { ONBOARDING_STEPS } from '@/shared/constants/onboardingSteps'

import AssetInstitutionCard from '@/features/asset/components/AssetInstitutionCard.vue'
import { useAssetStore } from '@/features/asset/store/assetStore'

const BUSINESS_TYPE_LABELS = {
  BK: '은행',
  ST: '증권',
}

const SKELETON_ROW_COUNT = 4

const router = useRouter()
const assetStore = useAssetStore()
const selectedIds = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const institutions = computed(() =>
  assetStore.organizations.map((organization) => ({
    id: organization.organizationCode,
    name: organization.organizationName,
    category: BUSINESS_TYPE_LABELS[organization.businessType] ?? organization.businessType,
  })),
)

const selectedCount = computed(() => selectedIds.value.length)
const canSubmit = computed(() => selectedCount.value > 0)

function isSelected(id) {
  return selectedIds.value.includes(id)
}

function toggleInstitution(id) {
  selectedIds.value = isSelected(id)
    ? selectedIds.value.filter((selectedId) => selectedId !== id)
    : [...selectedIds.value, id]
}

async function loadInstitutions() {
  errorMessage.value = ''
  isLoading.value = !assetStore.isLoaded

  try {
    await assetStore.fetchOrganizations()
  } catch {
    errorMessage.value = '연동 가능한 기관을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
  } finally {
    isLoading.value = false
  }
}

function handleNext() {
  if (!canSubmit.value) return
  const selected = institutions.value.filter((institution) => isSelected(institution.id))
  assetStore.setSelectedInstitutions(selected)
  router.push({ name: 'asset-auth' })
}

onMounted(loadInstitutions)
</script>

<template>
  <div class="asset-link-view">
    <AppHeader title="자산 연동" @back="router.back()" />
    <BaseBreadcrumb class="asset-link-view__steps" :steps="ONBOARDING_STEPS" :current="3" />

    <div class="asset-link-view__body">
      <div class="asset-link-view__intro">
        <h2 class="asset-link-view__title">연동할 기관을 선택하세요</h2>
        <p class="asset-link-view__subtitle">CODEF를 통해 안전하게 현재 고도(자산)를 측정해요</p>
      </div>

      <p v-if="errorMessage" class="asset-link-view__error">{{ errorMessage }}</p>

      <ul v-if="isLoading" class="asset-link-view__list">
        <li v-for="n in SKELETON_ROW_COUNT" :key="n">
          <BaseSkeleton height="76px" radius="16px" />
        </li>
      </ul>

      <ul v-else class="asset-link-view__list">
        <li v-for="institution in institutions" :key="institution.id">
          <AssetInstitutionCard
            :institution="institution"
            :selected="isSelected(institution.id)"
            @toggle="toggleInstitution"
          />
        </li>
      </ul>
    </div>

    <div class="asset-link-view__footer">
      <BaseButton size="lg" :disabled="!canSubmit" @click="handleNext">
        선택한 기관 연동하기 ({{ selectedCount }})
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.asset-link-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 390px;
  padding: 16px 24px 24px;
}

.asset-link-view__steps {
  align-self: center;
}

.asset-link-view__body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.asset-link-view__intro {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.asset-link-view__title {
  margin: 0;
  font-size: 15.9px;
  font-weight: 500;
  color: var(--text-h, #ffffff);
}

.asset-link-view__subtitle {
  margin: 0;
  font-size: 13.1px;
  color: var(--text, #9aa09a);
}

.asset-link-view__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.asset-link-view__error {
  margin: 0;
  font-size: 13px;
  color: #e03131;
}

.asset-link-view__footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
