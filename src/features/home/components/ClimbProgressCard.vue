<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'

import climbBackground from '@/assets/images/climb-bg.png'
import climberImage from '@/assets/images/climber.png'

/**
 * 목표가 없으면 climb·goal이 null로 온다. 그때도 일러스트는 그대로 보여주고
 * 캐릭터만 출발점에 세운다. 목표를 세우면 이 산을 오르게 된다는 걸 그림으로 보여주려는 것이다.
 */
const props = defineProps({
  climb: { type: Object, default: null },
  goal: { type: Object, default: null },
})

defineEmits(['create-goal'])

const hasGoal = computed(() => Boolean(props.goal && props.climb))

/**
 * 길 위의 기준점. 달성률을 좌표로 바꾸는 데 쓴다.
 *
 * <p>값은 배경 이미지(climb-bg.png) 기준 백분율이다. 길이 지그재그라 달성률을 좌표로
 * 바로 환산할 수 없어서, 배경의 길 픽셀에서 10% 간격으로 중심점을 뽑아뒀다.
 * 그 사이는 직선으로 잇는다.
 */
const PATH = [
  { at: 0, left: 50.8, top: 98.7 },
  { at: 10, left: 55.9, top: 90.4 },
  { at: 20, left: 61.1, top: 82.2 },
  { at: 30, left: 62.4, top: 74.9 },
  { at: 40, left: 55.9, top: 69.3 },
  { at: 50, left: 49.5, top: 64.4 },
  { at: 60, left: 40.5, top: 59.1 },
  { at: 70, left: 36.6, top: 52.8 },
  { at: 80, left: 45.6, top: 47.5 },
  { at: 90, left: 52.1, top: 42.6 },
  { at: 100, left: 52.7, top: 34.0 },
]

const progress = computed(() =>
  hasGoal.value ? Math.min(100, Math.max(0, props.climb.progressPercent)) : 0,
)

/** 기준점 두 개를 찾아 그 사이를 비례로 나눈다. */
const climberPosition = computed(() => {
  const value = progress.value
  let from = PATH[0]
  let to = PATH[PATH.length - 1]

  for (let i = 0; i < PATH.length - 1; i++) {
    if (value >= PATH[i].at && value <= PATH[i + 1].at) {
      from = PATH[i]
      to = PATH[i + 1]
      break
    }
  }

  const span = to.at - from.at
  const ratio = span === 0 ? 0 : (value - from.at) / span

  return {
    left: `${from.left + (to.left - from.left) * ratio}%`,
    top: `${from.top + (to.top - from.top) * ratio}%`,
  }
})

/* ------------------------------------------------------------------ */

/**
 * 게이지 10칸의 상태.
 *
 * <p>다 채운 칸은 진한 초록, 채우는 중인 한 칸은 노랑, 나머지는 빈 칸이다.
 * 반올림하지 않는다. 27%에서 세 칸이 다 찬 것처럼 보이면 안 된다.
 */
const segments = computed(() => {
  const filled = Math.floor(progress.value / 10)
  const hasPartial = progress.value % 10 > 0

  return Array.from({ length: 10 }, (_, i) => {
    if (i < filled) return 'filled'
    return i === filled && hasPartial ? 'current' : 'empty'
  })
})
</script>

<template>
  <div class="climb-progress-card">
    <div class="climb-card__illustration">
      <img class="climb-card__bg" :src="climbBackground" alt="" />

      <div class="climb-card__climber" :style="climberPosition">
        <img class="climb-card__climber-img" :src="climberImage" alt="" />
      </div>
    </div>

    <BaseCard class="climb-card__body">
      <template v-if="!hasGoal">
        <div class="climb-card__status">
          <span class="climb-card__quest-badge">NEW QUEST</span>
          <span class="climb-card__quest-label">아직 오를 정상이 없어요</span>
        </div>

        <div class="climb-card__empty">
          <p class="climb-card__empty-title">목표를 정하면 등반을 시작해요</p>
          <p class="climb-card__empty-desc">
            원하는 동네와 보증금을 입력하면 구간별 등반 계획을 만들어 드려요
          </p>
          <button type="button" class="climb-card__empty-cta" @click="$emit('create-goal')">
            + 목표 설정하러 가기
          </button>
        </div>
      </template>

      <template v-else>
        <div class="climb-card__status">
          <span class="climb-card__status-text">목표 금액의 {{ progress }}% 달성</span>
        </div>

        <div class="climb-card__segments">
          <span
            v-for="(state, i) in segments"
            :key="i"
            class="climb-card__segment"
            :class="`climb-card__segment--${state}`"
          />
        </div>
      </template>
    </BaseCard>
  </div>
</template>

<style scoped>
.climb-progress-card {
  display: flex;
  flex-direction: column;
  gap: 0;
  /* 일러스트+진행바 띠가 시각적으로 하나의 카드라, 그림자도 둘을 합친 바깥 테두리 기준으로
     한 번만 준다. 안쪽 BaseCard(.climb-card__body) 자체 그림자는 아래에서 꺼둔다. */
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

/* ── 일러스트 ─────────────────────────────────────────────── */

.climb-card__illustration {
  position: relative;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
  /* 배경 이미지가 높이를 정한다. 값을 따로 주면 이미지와 좌표가 어긋난다. */
  line-height: 0;
}

/* 픽셀 그림은 브라우저가 부드럽게 늘리면 뿌옇게 뭉갠다. */
.climb-card__illustration img {
  image-rendering: pixelated;
}

.climb-card__bg {
  display: block;
  width: 100%;
  height: auto;
}

/*
  캐릭터 폭은 (스프라이트 원본 폭 ÷ 배경 원본 폭) × 100 으로 준다.
*/
.climb-card__climber {
  position: absolute;
  width: 6.87%;
  /* 발끝이 길에 닿아야 해서 아래쪽을 기준으로 잡는다. */
  transform: translate(-50%, -100%);
  /* 달성률이 오르면 길을 따라 걸어 올라가는 것처럼 보인다. */
  transition:
    left 0.9s ease-in-out,
    top 0.9s ease-in-out;
}

.climb-card__climber-img {
  display: block;
  width: 100%;
}

/* 화면 움직임을 꺼둔 사용자에게는 움직이지 않는다. */
@media (prefers-reduced-motion: reduce) {
  .climb-card__climber {
    transition: none;
  }
}

/* ── 아래 요약 카드 ────────────────────────────────────────── */

/*
  글자색 두 단계.
    --climb-card-ink        목표 제목, 퍼센트   제일 진하게
    --climb-card-ink-muted  보조 정보           회녹색

  opacity 대신 색을 직접 준다. 투명도로 흐리게 하면 배경색이 바뀔 때 같이 흔들린다.
  (main.css의 [data-theme] 블록에서 테마별 값을 정의한다.)
*/
.climb-card__body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  background: var(--climb-card-surface, #cdedd3);
  /* 위쪽은 일러스트와 맞닿아 이미 둥글어서(.climb-card__illustration) 각지게 두고,
     카드 바깥 아래쪽 두 모서리만 다른 카드처럼 둥글린다. */
  border-radius: 0 0 16px 16px;
  /* 그림자는 .climb-progress-card가 일러스트까지 합쳐 한 번만 준다. */
  box-shadow: none;
  letter-spacing: 0.02em;
  /*
    루트의 145%는 18px 기준으로 계산된 26.1px이 그대로 상속된다. 여기 글자는 11~15px이라
    줄 사이가 과하게 벌어진다. 단위 없는 값으로 덮어써야 각 글자 크기에 맞춰 계산된다.
  */
  line-height: 1.25;
}

/* ── 목표가 없을 때 ──────────────────────────────────────── */

.climb-card__quest-badge {
  flex: none;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--climb-card-ink, #12281c);
  color: var(--color-accent, #ffd939);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.06em;
}

.climb-card__quest-label {
  flex: 1;
  margin-left: 8px;
  font-weight: 700;
  color: var(--climb-card-ink-muted, #6f8b79);
}

.climb-card__empty {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 목표가 있을 때의 목표 제목과 같은 크기. 이 카드에서 제일 큰 글자다. */
.climb-card__empty-title {
  margin: 0;
  font-size: 15px;
  font-weight: 900;
  color: var(--home-ink-text, #12281c);
}

.climb-card__empty-desc {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  color: var(--climb-card-ink-muted, #6f8b79);
}

/*
  가로를 꽉 채운다. 이 화면에서 할 수 있는 일이 이것 하나뿐이라 작게 둘 이유가 없다.
*/
.climb-card__empty-cta {
  width: 100%;
  margin-top: 4px;
  padding: 9px 0;
  border: none;
  border-radius: 999px;
  background: var(--climb-card-ink, #12281c);
  color: var(--color-accent, #ffd939);
  font: inherit;
  font-size: 13.5px;
  font-weight: 900;
  cursor: pointer;
}

/* ── 목표가 있을 때 ──────────────────────────────────────── */

/* 목표 제목/자세히/남은 금액은 진행 중인 목표 카드(ActiveGoalCard)로 옮겼다.
   여기는 달성률 한 줄 + 게이지만 남는다. */
.climb-card__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 900;
  color: var(--climb-card-ink, #12281c);
}

/* 왼쪽 정렬을 justify-content 계산에 기대지 않고 확실하게 고정한다. */
.climb-card__status-text {
  margin-right: auto;
}

/* 퍼센트를 게이지 오른쪽 끝에 붙인다. 아래에 따로 두면 줄만 하나 늘어난다. */
.climb-card__segments {
  display: flex;
  align-items: center;
  gap: 4px;
}

.climb-card__segment {
  flex: 1;
  height: 11px;
  border-radius: 2px;
}

.climb-card__segment--empty {
  background: var(--climb-card-progress-inactive, #a9c6af);
}

.climb-card__segment--filled {
  background: var(--color-progress-active, #1d6b3f);
}

.climb-card__segment--current {
  background: var(--color-accent, #ffd939);
}
</style>
