<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

import climberImage from '@/assets/images/climber.png'

// 실제 추천 계산은 4개 알고리즘이 각각 실거래를 훑어서 수 초가 걸릴 수 있다.
// 한 문장만 띄워두면 멈춘 것처럼 보여서, 지금 무슨 일이 일어나는지 순서대로 바꿔 보여준다.
const MESSAGES = [
  '입력하신 조건을 정리하고 있어요',
  '그 지역 실거래가를 살펴보는 중이에요',
  '지금 자산으로 갈 수 있는 길을 계산하고 있어요',
  '거의 다 됐어요',
]

const messageIndex = ref(0)
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    // 마지막 문구에 도달하면 거기서 멈춘다 — 계속 돌면 진행되지 않는 느낌을 준다.
    if (messageIndex.value < MESSAGES.length - 1) messageIndex.value += 1
  }, 1600)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="goal-recommendation-loading">
    <div class="goal-recommendation-loading__stage">
      <img class="goal-recommendation-loading__climber" :src="climberImage" alt="" />
      <div class="goal-recommendation-loading__track">
        <span class="goal-recommendation-loading__bar" />
      </div>
    </div>

    <div class="goal-recommendation-loading__text">
      <h2 class="goal-recommendation-loading__title">조건에 맞는 목표를<br />찾고 있어요</h2>
      <!-- key를 바꿔 문구가 교체될 때마다 페이드 인이 다시 실행되게 한다 -->
      <p :key="messageIndex" class="goal-recommendation-loading__message">
        {{ MESSAGES[messageIndex] }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.goal-recommendation-loading {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  min-height: 60vh;
  padding: 40px 0;
  text-align: center;
}

.goal-recommendation-loading__stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
  max-width: 240px;
}

.goal-recommendation-loading__climber {
  /*
    climber.png는 1086x1448(세로로 긴 3:4) 이미지다. 예전 96x96 정사각 스프라이트 시절의
    56x56 고정값을 그대로 두면 3:4 그림을 1:1 상자에 욱여넣게 되어 위아래로 눌린다.
    가로만 정하고 세로는 비율대로 따라오게 둔다(홈 ClimbProgressCard와 같은 처리).
  */
  width: 56px;
  height: auto;
  /*
    flex-direction:column 컨테이너 안에서는 세로가 main axis라, 공간이 모자라면
    flex-shrink 기본값(1)에 걸려 세로만 더 줄어든다. 축소 대상에서 뺀다.
  */
  flex-shrink: 0;
  /*
    image-rendering: pixelated는 원본을 확대할 때 쓰는 값이다. 지금은 1448px을 약 75px로
    줄이는 축소라, 최근접 보간이 픽셀 행/열을 불규칙하게 버려 오히려 계단이 생긴다.
    브라우저 기본 보간에 맡긴다.
  */
  animation: goal-loading-hop 0.9s ease-in-out infinite;
}

.goal-recommendation-loading__track {
  position: relative;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: var(--color-progress-inactive, #262626);
  overflow: hidden;
}

.goal-recommendation-loading__bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  height: 100%;
  border-radius: 2px;
  /* 라이트 모드의 밝은 배경에서도 보이도록, 테마별 대비가 잡혀 있는 버튼 색을 쓴다 */
  background: var(--base-button-primary-bg, #e3ffe8);
  animation: goal-loading-slide 1.4s ease-in-out infinite;
}

.goal-recommendation-loading__text {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.goal-recommendation-loading__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.5px;
  color: var(--color-text-primary, #ffffff);
}

.goal-recommendation-loading__message {
  margin: 0;
  font-size: 13.2px;
  color: var(--color-text-secondary, #9aa09a);
  animation: goal-loading-fade 0.5s ease;
}

@keyframes goal-loading-hop {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

@keyframes goal-loading-slide {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(250%);
  }
}

@keyframes goal-loading-fade {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 모션 민감 사용자를 위해 반복 애니메이션은 끄고 진행 표시만 남긴다 */
@media (prefers-reduced-motion: reduce) {
  .goal-recommendation-loading__climber,
  .goal-recommendation-loading__bar,
  .goal-recommendation-loading__message {
    animation: none;
  }

  .goal-recommendation-loading__bar {
    width: 100%;
  }
}
</style>
