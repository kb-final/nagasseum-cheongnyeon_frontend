<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/shared/components/molecules/AppHeader.vue'
import BaseSkeleton from '@/shared/components/atoms/feedback/Skeleton/BaseSkeleton.vue'
import { formatEok, formatManwon, formatYearMonthKo } from '@/shared/utils/formatter'
import { HOUSING_TYPE_LABEL, DEAL_TYPE_LABEL } from '@/shared/constants/housing'
import { findRegionBySigunguCode } from '@/shared/constants/regions'
import { useToast } from '@/shared/composables/useToast'

import GoalProgressCard from '@/features/goal/components/GoalProgressCard.vue'
import SavingForecastCard from '@/features/goal/components/SavingForecastCard.vue'
import MonthlySavingEditModal from '@/features/goal/components/MonthlySavingEditModal.vue'
import MarketPriceAlertCard from '@/features/goal/components/MarketPriceAlertCard.vue'
import { useGoalStore } from '@/features/goal/store/goalStore'

const props = defineProps({
  goalId: { type: [String, Number], required: true },
})

const router = useRouter()
const goalStore = useGoalStore()
const toast = useToast()

const detail = computed(() => goalStore.goalDetail)

// 상세 조회 응답에는 title 필드가 없어서 "강남구 오피스텔 전세" 형태로 직접 조합한다.
const conditionTitle = computed(() => {
  if (!detail.value) return ''

  const { regionCode, housingType, dealType } = detail.value.housing
  const sigunguName = findRegionBySigunguCode(regionCode)?.sigunguName ?? ''
  return [
    sigunguName,
    HOUSING_TYPE_LABEL[housingType] ?? housingType,
    DEAL_TYPE_LABEL[dealType] ?? dealType,
  ]
    .filter(Boolean)
    .join(' ')
})

// 조건 요약: "10~20평 · 보증금 3억~6억 · 목표 시점 2028년 9월"
// 지역/매물유형/거래유형은 바로 위 제목(conditionTitle)에 이미 나오니 여기서는 중복하지 않는다.
const conditionSummary = computed(() => {
  if (!detail.value) return ''

  const { areaMin, areaMax, depositMin, depositMax } = detail.value.housing
  return [
    `${areaMin}~${areaMax}평`,
    `보증금 ${formatEok(depositMin)}~${formatEok(depositMax)}`,
    `목표 시점 ${formatYearMonthKo(detail.value.targetDate)}`,
  ].join(' · ')
})

onMounted(() => {
  goalStore.loadGoalDetail(props.goalId)
  goalStore.loadMarketAlert()
})

// 목표 수정은 UC-12(진단 폼)를 재사용하는 것이 기획 상 흐름이다.
// 값이 채워진 전용 수정 폼은 별도 작업으로 분리되어 있어, 지금은 진단 화면으로 보낸다.
// goal-edit 라우트로 보내야 진단 화면이 생성(POST)이 아니라 수정(PUT)으로 저장한다.
function goToEditGoal() {
  router.push({ name: 'goal-edit', params: { goalId: props.goalId } })
}

const isSavingModalOpen = ref(false)

// 저축 계획을 바꾸면 상세 화면에 그대로 머무르면서, 바뀐 값으로 화면을 다시 불러오고
// 상단에 변경 완료 알림을 띄운다.
async function onSubmitMonthlySaving(monthlySaving) {
  const updated = await goalStore.updateMonthlySaving(props.goalId, monthlySaving)
  if (!updated) return

  isSavingModalOpen.value = false
  await goalStore.loadGoalDetail(props.goalId)
  toast.show(`월 저축 계획이 ${formatManwon(monthlySaving)}으로 변경되었어요.`, {
    type: 'success',
    position: 'top',
  })
}
</script>

<template>
  <div class="goal-detail-view">
    <AppHeader title="목표 상세" :show-back="false">
      <template #action>
        <button
          v-if="detail"
          type="button"
          class="goal-detail-view__edit-link"
          @click="goToEditGoal"
        >
          수정하기
        </button>
      </template>
    </AppHeader>

    <template v-if="detail">
      <div class="goal-detail-view__summary">
        <h2 class="goal-detail-view__title">{{ conditionTitle }}</h2>
        <p class="goal-detail-view__condition">{{ conditionSummary }}</p>
      </div>

      <GoalProgressCard :progress="detail.progress" />

      <SavingForecastCard
        :saving-status="detail.savingStatus"
        :forecasts="detail.forecasts"
        :target-date="detail.targetDate"
        @change-saving="isSavingModalOpen = true"
      />

      <p v-if="goalStore.updateError" class="goal-detail-view__error">
        월 저축 계획을 수정하지 못했어요.
      </p>

      <MarketPriceAlertCard v-if="goalStore.marketAlert" :market-alert="goalStore.marketAlert" />

      <MonthlySavingEditModal
        v-model="isSavingModalOpen"
        :detail="detail"
        :is-submitting="goalStore.isUpdating"
        @submit="onSubmitMonthlySaving"
      />
    </template>

    <div v-else-if="goalStore.isLoadingDetail" class="goal-detail-view__skeleton">
      <BaseSkeleton height="60px" radius="16px" />
      <BaseSkeleton height="200px" radius="16px" />
      <BaseSkeleton height="320px" radius="16px" />
    </div>

    <p v-else-if="goalStore.detailError" class="goal-detail-view__error">
      목표 정보를 불러오지 못했어요.
    </p>
  </div>
</template>

<style scoped>
.goal-detail-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.goal-detail-view__edit-link {
  padding: 0;
  border: none;
  background: none;
  color: #7fa398;
  font-size: 13px;
  cursor: pointer;
}

.goal-detail-view__summary {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.goal-detail-view__title {
  margin: 0;
  font-size: 20px;
  font-weight: 400;
  color: var(--accent, #e3ffe8);
}

.goal-detail-view__condition {
  margin: 0;
  font-size: 13px;
  color: #888888;
}

.goal-detail-view__skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.goal-detail-view__error {
  padding: 24px 0;
  color: var(--text, #9aa09a);
  text-align: center;
}
</style>
