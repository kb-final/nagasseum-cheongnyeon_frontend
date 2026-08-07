<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/shared/components/molecules/AppHeader.vue'
import BaseBadge from '@/shared/components/atoms/base/badge/BaseBadge.vue'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import BaseSkeleton from '@/shared/components/atoms/feedback/Skeleton/BaseSkeleton.vue'
import { formatEok, formatManwon, formatYearMonthKo } from '@/shared/utils/formatter'
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

// 조건 요약: "10~20평 · 보증금 3억~6억 · 목표 시점 2028년 9월"
const conditionSummary = computed(() => {
  if (!detail.value) return ''

  const { areaMin, areaMax, depositMin, depositMax } = detail.value.housing
  return [
    `${areaMin}~${areaMax}평`,
    `보증금 ${formatEok(depositMin)}~${formatEok(depositMax)}`,
    `목표 시점 ${formatYearMonthKo(detail.value.targetDate)}`,
  ].join(' · ')
})

// 상세 조회 응답에는 등반 레벨이 없어서 달성률 25%p 구간으로 환산해 표시한다.
// 백엔드가 레벨을 내려주면 그 값으로 교체해야 한다.
const climbLevel = computed(() => {
  if (!detail.value) return 1
  return Math.min(Math.floor(detail.value.progress.achievementRate / 25) + 1, 4)
})

onMounted(() => {
  goalStore.loadGoalDetail(props.goalId)
  goalStore.loadMarketAlert()
})

// 목표 수정은 UC-12(진단 폼)를 재사용하는 것이 기획 상 흐름이다.
// 값이 채워진 전용 수정 폼은 별도 작업으로 분리되어 있어, 지금은 진단 화면으로 보낸다.
function goToEditGoal() {
  router.push({ name: 'diagnosis' })
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
    <AppHeader title="목표 상세" @back="router.back()">
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
        <div class="goal-detail-view__title-row">
          <h2 class="goal-detail-view__title">{{ detail.housing.title }}</h2>
          <BaseBadge variant="mint">Lv.{{ climbLevel }} 등반가</BaseBadge>
        </div>
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

      <BaseButton variant="primary" @click="goToEditGoal">목표 수정하기</BaseButton>

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

.goal-detail-view__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
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
