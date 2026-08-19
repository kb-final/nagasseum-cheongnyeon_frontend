<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/shared/components/molecules/AppHeader.vue'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'

import GoalStepProgress from '@/features/goal/components/steps/GoalStepProgress.vue'
import GoalStepFrame from '@/features/goal/components/steps/GoalStepFrame.vue'
import GoalRegionStep from '@/features/goal/components/steps/GoalRegionStep.vue'
import GoalChoiceStep from '@/features/goal/components/steps/GoalChoiceStep.vue'
import GoalRangeStep from '@/features/goal/components/steps/GoalRangeStep.vue'
import GoalTargetDateStep from '@/features/goal/components/steps/GoalTargetDateStep.vue'
import GoalRecommendationLoading from '@/features/goal/components/steps/GoalRecommendationLoading.vue'
import { useGoalConditionSteps } from '@/features/goal/composables/useGoalConditionSteps'
import { useGoalStore } from '@/features/goal/store/goalStore'

const router = useRouter()
const goalStore = useGoalStore()

const {
  form,
  currentStep,
  currentIndex,
  totalSteps,
  isFirstStep,
  isLastStep,
  canGoNext,
  canSkip,
  goNext,
  goPrev,
  skip,
  buildPayload,
} = useGoalConditionSteps()

// 추천 결과 화면의 라우트 이름. 그 화면은 별도로 작업 중이라 아직 라우터에 등록되어 있지 않다.
// 등록되는 순간 이 화면은 고칠 것 없이 그대로 이어진다 — 추천 목록은 goalStore.recommendations에 있다.
const RESULT_ROUTE_NAME = 'goal-recommendations'

// 'steps' 조건 입력 중 → 'loading' 추천 계산 중 → 'error'
// 성공하면 이 화면에는 머무를 상태가 없다. 결과 화면으로 넘겨주는 것이 마지막 일이다.
const phase = ref('steps')

// 앞/뒤 중 어느 방향으로 움직이는지에 따라 화면이 밀려 들어오는 방향을 바꾼다.
const transitionName = ref('goal-step-forward')

function handleBack() {
  if (phase.value !== 'steps') {
    // 로딩/에러 상태에서 뒤로 가면 마지막 입력 화면으로 돌아온다
    phase.value = 'steps'
    return
  }
  if (isFirstStep.value) {
    router.back()
    return
  }
  transitionName.value = 'goal-step-backward'
  goPrev()
}

async function submit() {
  phase.value = 'loading'

  const succeeded = await goalStore.loadRecommendations(buildPayload())
  if (!succeeded) {
    phase.value = 'error'
    return
  }

  // 진단을 마치고 결과 화면으로 "처음" 넘어가는 순간에만 세운다 — 결과 화면이 마운트 시
  // 이 값을 한 번 읽고 바로 꺼서, 상세 화면을 오가는 재진입에서는 인트로가 다시 재생되지 않는다.
  goalStore.playResultIntro = true

  try {
    await router.push({ name: RESULT_ROUTE_NAME })
  } catch {
    // 결과 화면 라우트가 아직 없으면 이동에 실패한다. 이때 가짜 결과를 대신 그리면
    // 나중에 지워야 할 화면이 하나 더 생기므로, 로딩 화면에 머문 채 개발자에게만 알린다.
    console.error(
      `[goal] '${RESULT_ROUTE_NAME}' 라우트가 아직 등록되지 않았습니다. 추천 결과 화면을 라우터에 추가해주세요.`,
    )
  }
}

function handleNext() {
  transitionName.value = 'goal-step-forward'
  // 마지막 단계에서 true를 돌려주면 더 갈 곳이 없다는 뜻이라 제출로 넘어간다
  if (goNext()) submit()
}

function handleSkip() {
  transitionName.value = 'goal-step-forward'
  if (skip()) submit()
}
</script>

<template>
  <div class="goal-steps-view">
    <AppHeader title="목표 설정" @back="handleBack" />

    <template v-if="phase === 'steps'">
      <GoalStepProgress
        class="goal-steps-view__progress"
        :current="currentIndex + 1"
        :total="totalSteps"
      />

      <div class="goal-steps-view__body">
        <Transition :name="transitionName" mode="out-in">
          <GoalStepFrame
            :key="currentStep.key"
            :title="currentStep.title"
            :description="currentStep.description"
          >
            <GoalRegionStep v-if="currentStep.kind === 'region'" v-model="form.regionCode" />

            <GoalChoiceStep
              v-else-if="currentStep.kind === 'choice'"
              v-model="form[currentStep.key]"
              :options="currentStep.options"
            />

            <GoalRangeStep
              v-else-if="currentStep.kind === 'range'"
              v-model="form[currentStep.field]"
              :min="currentStep.min"
              :max="currentStep.max"
              :step="currentStep.step"
              :format-value="currentStep.formatValue"
            />

            <GoalTargetDateStep v-else v-model="form.targetDate" />
          </GoalStepFrame>
        </Transition>
      </div>

      <div class="goal-steps-view__footer">
        <BaseButton size="lg" :disabled="!canGoNext" @click="handleNext">
          {{ isLastStep ? '목표 찾기' : '다음' }}
        </BaseButton>
        <!--
          건너뛸 수 없는 단계에서도 자리는 남겨둔다. 버튼이 생겼다 사라지면 '다음' 버튼의
          세로 위치가 단계마다 흔들려서, 연속으로 누를 때 엉뚱한 곳을 누르게 된다.
        -->
        <button v-if="canSkip" type="button" class="goal-steps-view__skip" @click="handleSkip">
          이 조건은 건너뛸게요
        </button>
        <span v-else class="goal-steps-view__skip-placeholder" />
      </div>
    </template>

    <GoalRecommendationLoading v-else-if="phase === 'loading'" />

    <div v-else class="goal-steps-view__result">
      <h2 class="goal-steps-view__result-title">추천을 불러오지 못했어요</h2>
      <p class="goal-steps-view__result-description">
        {{ goalStore.recommendError?.message ?? '잠시 후 다시 시도해 주세요.' }}
      </p>

      <div class="goal-steps-view__footer">
        <BaseButton size="lg" @click="submit">다시 시도</BaseButton>
        <button type="button" class="goal-steps-view__skip" @click="phase = 'steps'">
          조건 다시 고르기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
  공용 form 컴포넌트(BaseDualRangeSlider·BaseYearMonthSelect)가 테마를 안 타는 legacy 변수
  --text-h / --text / --border / --card-bg를 쓴다. main.css의 [data-theme] 블록에 없는 값이라
  라이트 모드에서 흰 글씨가 그대로 남는다. AuthLayout이 쓰는 방식과 같이, 공용 컴포넌트를
  고치지 않고 이 화면 안에서만 시맨틱 토큰으로 덮어씌운다.
*/
.goal-steps-view {
  --text-h: var(--color-text-primary);
  --text: var(--color-text-secondary);
  --border: var(--color-border);
  --card-bg: var(--color-surface);

  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 32px);
}

/* 슬라이더 채움색이 #e3ffe8로 박혀 있어 라이트 모드의 흰 배경에서 거의 보이지 않는다.
   테마별로 대비가 확보된 버튼 색을 그대로 쓴다. */
.goal-steps-view :deep(.range-slider__fill) {
  background: var(--base-button-primary-bg, #e3ffe8);
}

/*
  AppHeader가 sticky top:0으로 붙어 있고 높이가 49px(패딩 12+12 + 내용 24 + 아래 테두리 1)이다.
  진행 표시줄을 그 바로 밑에 붙여, 지역 단계처럼 본문이 긴 화면에서도 몇 번째 단계인지 계속 보이게 한다.
*/
.goal-steps-view__progress {
  position: sticky;
  top: 49px;
  z-index: 4;
  padding: 20px 0 12px;
  background: var(--color-app-bg, #111111);
}

.goal-steps-view__body {
  flex: 1;
  padding: 20px 0 32px;
}

/*
  지역 단계는 서울만 해도 구·군 칩이 25개라 본문이 화면보다 길다. 푸터를 흐름대로 두면
  '다음' 버튼이 접힌 화면 아래로 내려가 버려서, 고른 뒤에도 다음으로 갈 방법이 안 보인다.
  화면 아래에 붙여두고 배경을 앱 배경색으로 채워 뒤 내용이 비치지 않게 한다.
*/
.goal-steps-view__footer {
  position: sticky;
  bottom: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 0 8px;
  background: var(--color-app-bg, #111111);
}

.goal-steps-view__skip {
  padding: 10px 8px;
  border: none;
  background: none;
  color: var(--color-text-tertiary, #6f766d);
  font: inherit;
  font-size: 13.2px;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.goal-steps-view__skip-placeholder {
  display: block;
  height: 41px;
}

.goal-steps-view__result {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding-top: 48px;
}

.goal-steps-view__result-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.5px;
  color: var(--color-text-primary, #ffffff);
}

.goal-steps-view__result-description {
  margin: 0 0 12px;
  font-size: 13.2px;
  line-height: 1.6;
  color: var(--color-text-secondary, #9aa09a);
}

/* 에러 화면은 본문이 두세 줄뿐이라, 버튼이 글 바로 밑에 붙지 않고 입력 단계와 같은 자리에 오도록 민다 */
.goal-steps-view__result .goal-steps-view__footer {
  margin-top: auto;
}

.goal-step-forward-enter-active,
.goal-step-forward-leave-active,
.goal-step-backward-enter-active,
.goal-step-backward-leave-active {
  transition:
    opacity 0.24s ease,
    transform 0.24s ease;
}

.goal-step-forward-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.goal-step-forward-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

.goal-step-backward-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

.goal-step-backward-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

@media (prefers-reduced-motion: reduce) {
  .goal-step-forward-enter-active,
  .goal-step-forward-leave-active,
  .goal-step-backward-enter-active,
  .goal-step-backward-leave-active {
    transition: opacity 0.12s linear;
  }

  .goal-step-forward-enter-from,
  .goal-step-forward-leave-to,
  .goal-step-backward-enter-from,
  .goal-step-backward-leave-to {
    transform: none;
  }
}
</style>
