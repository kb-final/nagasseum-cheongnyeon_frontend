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
  <div
    class="goal-recommendations-view"
    :class="{ 'goal-recommendations-view--animated': sortedRecommendations.length > 0 }"
  >
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

    <template v-else>
      <ul class="goal-recommendations-view__list">
        <li v-for="recommendation in sortedRecommendations" :key="recommendation.type">
          <RecommendationCard :recommendation="recommendation" @select="goToDetail" />
        </li>
      </ul>

      <BaseButton
        variant="secondary"
        size="lg"
        class="goal-recommendations-view__retry"
        @click="goToDiagnosis"
      >
        다시 진단하기
      </BaseButton>
    </template>
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

/* 민트(--color-mint-strong)는 이 화면 다른 곳에 안 쓰여서 혼자 붕 떠 보였다. 이 화면이 이미
   강조색으로 쓰고 있는 초록 계열(전략 문구·"자세히 보기"의 --color-primary) 톤으로 맞춘다 —
   SavingForecastCard/MonthlySavingEditModal의 CTA와 같은 --color-primary-soft 조합 재사용. */
.goal-recommendations-view__retry {
  margin-top: 4px;
  background: var(--color-primary-soft, #e8f4ea);
  color: #353934;
}

/*
  홈/비교/목표 상세 화면과 같은 card-rise 진입 모션(main.css에 공용 정의)을 재사용한다.
  로딩/에러/빈 상태에는 적용하지 않고, 실제 추천 목록이 준비된 뒤에만(v-else 분기) 애니메이션이
  실행되게 sortedRecommendations.length로 게이트를 건다(GoalDetailView의 `detail` 게이트와 동일한 방식).
*/
.goal-recommendations-view--animated > * {
  animation: card-rise 0.35s ease-out both;
}

.goal-recommendations-view--animated > *:nth-child(2) {
  animation-delay: 0.06s;
}

.goal-recommendations-view--animated > *:nth-child(3) {
  animation-delay: 0.12s;
}

.goal-recommendations-view--animated > *:nth-child(4) {
  animation-delay: 0.18s;
}
</style>
