<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/shared/components/molecules/AppHeader.vue'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import BaseSkeleton from '@/shared/components/atoms/feedback/Skeleton/BaseSkeleton.vue'
import BaseEmptyState from '@/shared/components/atoms/feedback/EmptyState/BaseEmptyState.vue'

import RecommendationCard from '@/features/goal/components/RecommendationCard.vue'
import { useGoalStore } from '@/features/goal/store/goalStore'
import { sortRecommendations } from '@/features/goal/utils/recommendationViewModel'

const SKELETON_CARD_COUNT = 3

// 결과 상세 화면의 라우트 이름. 상세 화면은 별도로 작업 중이라 아직 라우터에 등록되어 있지
// 않다. 등록되는 순간 이 화면은 고칠 것 없이 그대로 이어진다 — 카드가 들고 있는 recommendation
// 전체(type/title/reason/condition/loanX/loanO)는 goalStore.recommendations에 그대로 있다.
const DETAIL_ROUTE_NAME = 'goal-recommendation-detail'

const router = useRouter()
const goalStore = useGoalStore()

const sortedRecommendations = computed(() => sortRecommendations(goalStore.recommendations))

onMounted(() => {
  goalStore.loadRecommendationResult()
})

async function goToDetail(recommendation) {
  try {
    // 이름이 등록되지 않은 라우트로 push하면 반환된 Promise가 아니라 호출 시점에 동기적으로
    // 던져지므로, .catch() 체이닝이 아니라 try/catch로 감싸야 한다
    // (GoalConditionStepsView.submit()과 동일한 패턴).
    await router.push({ name: DETAIL_ROUTE_NAME, params: { type: recommendation.type } })
  } catch {
    // 상세 화면 라우트가 아직 없으면 이동에 실패한다. 이때 화면이 멈춘 것처럼 보이지 않도록
    // 현재 목록 화면에 그대로 머문 채 개발자에게만 알린다.
    console.error(
      `[goal] '${DETAIL_ROUTE_NAME}' 라우트가 아직 등록되지 않았습니다. 추천 상세 화면을 라우터에 추가해주세요.`,
    )
  }
}

function goToDiagnosis() {
  router.push({ name: 'diagnosis' })
}
</script>

<template>
  <div class="goal-recommendations-view">
    <AppHeader title="진단 결과" @back="router.back()" />

    <div class="goal-recommendations-view__intro">
      <h2 class="goal-recommendations-view__title">나에게 맞는 주거 계획을 비교해보세요</h2>
      <p class="goal-recommendations-view__description">
        원하는 조건, 목표 시점에 따라 달라지는 선택지를 확인할 수 있어요.
      </p>
    </div>

    <ul v-if="goalStore.isRecommending" class="goal-recommendations-view__list">
      <li v-for="n in SKELETON_CARD_COUNT" :key="n">
        <BaseSkeleton height="220px" radius="16px" />
      </li>
    </ul>

    <div v-else-if="goalStore.recommendError" class="goal-recommendations-view__state">
      <BaseEmptyState message="추천 결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요." />
      <BaseButton size="lg" @click="goalStore.loadRecommendationResult">다시 시도</BaseButton>
    </div>

    <div v-else-if="sortedRecommendations.length === 0" class="goal-recommendations-view__state">
      <BaseEmptyState message="조건에 맞는 계획을 찾지 못했어요." />
      <BaseButton size="lg" @click="goToDiagnosis">다시 진단하기</BaseButton>
    </div>

    <ul v-else class="goal-recommendations-view__list">
      <li v-for="recommendation in sortedRecommendations" :key="recommendation.type">
        <RecommendationCard :recommendation="recommendation" @select="goToDetail" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.goal-recommendations-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 32px;
}

.goal-recommendations-view__intro {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 8px 0 4px;
}

.goal-recommendations-view__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.5px;
  color: var(--color-text-primary, #ffffff);
}

.goal-recommendations-view__description {
  margin: 0;
  font-size: 13.2px;
  line-height: 1.6;
  color: var(--color-text-secondary, #9aa09a);
}

.goal-recommendations-view__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.goal-recommendations-view__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 16px;
}
</style>
