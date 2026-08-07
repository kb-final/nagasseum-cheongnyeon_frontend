<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import { formatWon, formatEok } from '@/shared/utils/formatter'

import climbBackground from '@/assets/images/climb-bg.png'
import climberImage from '@/assets/images/climber.png'
import lockSignImage from '@/assets/images/lockSign.png'
import signTorchOff from '@/assets/images/signTorchOff.png'
import signTorchOn from '@/assets/images/signTorchOn.png'
import torchOff from '@/assets/images/torchOff.png'
import torchOn from '@/assets/images/torchOn.png'

const props = defineProps({
  climb: { type: Object, required: true },
  goal: { type: Object, required: true },
})

defineEmits(['view-goal'])

/* ------------------------------------------------------------------
 * 일러스트 좌표
 *
 * 모든 값은 배경 이미지(climb-bg.png, 1720x2662) 기준 백분율이다.
 * 배경을 바꾸면 여기도 같이 바꿔야 해서 한곳에 모아둔다.
 * ------------------------------------------------------------------ */

/**
 * 길 위의 기준점. 달성률을 좌표로 바꾸는 데 쓴다.
 *
 * <p>길이 지그재그라 달성률을 좌표로 바로 환산할 수 없다. 배경의 길 픽셀에서
 * 10% 간격으로 중심점을 뽑아뒀고, 그 사이는 직선으로 잇는다.
 */
const PATH = [
  { at: 0, left: 54.2, top: 100.0 },
  { at: 10, left: 47.9, top: 95.5 },
  { at: 20, left: 42.3, top: 91.9 },
  { at: 30, left: 37.4, top: 88.3 },
  { at: 40, left: 31.8, top: 84.4 },
  { at: 50, left: 36.0, top: 79.0 },
  { at: 60, left: 44.4, top: 73.5 },
  { at: 70, left: 52.8, top: 68.1 },
  { at: 80, left: 52.1, top: 62.1 },
  { at: 90, left: 47.9, top: 56.5 },
  { at: 100, left: 53.6, top: 53.5 },
]

/**
 * 길가의 등불. `at`은 이 등불이 서 있는 지점의 달성률이라, 캐릭터가 지나가면 켜진다.
 * `left`/`top`은 등불 기둥 바닥의 좌표다. 켜짐/꺼짐 이미지 크기가 달라서
 * 이미지 모서리가 아니라 기둥 바닥을 기준점으로 잡아야 불꽃이 안 튄다.
 */
const TORCHES = [{ at: 40, left: 18.0, top: 84.4 }]

/** 두 번째 등불. 표지판 위에 달려 있어 이미지가 따로다. */
const SIGN_TORCH = { at: 75, left: 66.5, top: 67.5 }

/** 집 앞 자물쇠 표지판. 길 위에 놓여 길을 막는다. 100% 완주해야 사라진다. */
const LOCK_SIGN = { left: 50.0, top: 57.3 }

/** 서버 값이 범위를 벗어나면 좌표 계산이 깨진다. 그대로 믿지 않는다. */
const progress = computed(() => Math.min(100, Math.max(0, props.climb.progressPercent)))

const torches = computed(() =>
  TORCHES.map((torch) => ({ ...torch, lit: progress.value >= torch.at })),
)

const signTorchLit = computed(() => progress.value >= SIGN_TORCH.at)

/** 100%가 되면 자물쇠가 풀린다. 이 화면에서 유일하게 사라지는 요소다. */
const unlocked = computed(() => progress.value >= 100)

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
 * 카드 한 줄에 들어갈 만큼 줄인 지역명.
 *
 * <p>서버는 "서울특별시 강남구"처럼 시도까지 붙여서 준다. 한 줄에 주거형태·거래유형·
 * 금액까지 같이 들어가야 해서 뺄 수 있으면 뺀다.
 *
 * <p>다만 시도를 무조건 떼면 안 된다.
 *   특별시·광역시   서울특별시 강남구 → 강남구      구 이름만으로 어디인지 안다
 *   도             경기도 부천시    → 경기도 부천시  시 이름만 남기면 헷갈린다
 * 앞 덩어리가 '시'로 끝나면 떼고, '도'로 끝나면 남긴다.
 *
 * <p>"경기도 고양시 덕양구"처럼 세 단계도 그대로 둔다. 마지막만 남기면 어느 시인지
 * 알 수 없다.
 */
function shortRegionName(regionName) {
  const parts = String(regionName ?? '')
    .trim()
    .split(/\s+/)

  if (parts.length < 2) {
    return parts.join(' ')
  }
  return parts[0].endsWith('시') ? parts.slice(1).join(' ') : parts.join(' ')
}

const goalTitle = computed(
  () =>
    `${shortRegionName(props.goal.regionName)} ${props.goal.housingType} ${props.goal.dealType} ${formatEok(props.goal.targetAmount)}`,
)

// "2028-03-31" -> "2028.03"
const targetEta = computed(() => props.goal.targetDate.slice(0, 7).replace('-', '.'))

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
      <!-- 오각형 모양은 이미지 자체의 투명 영역이라 clip-path가 따로 필요 없다. -->
      <img class="climb-card__bg" :src="climbBackground" alt="" />

      <img
        v-for="torch in torches"
        :key="torch.at"
        class="climb-card__torch"
        :class="{ 'climb-card__torch--lit': torch.lit }"
        :style="{ left: `${torch.left}%`, top: `${torch.top}%` }"
        :src="torch.lit ? torchOn : torchOff"
        alt=""
      />

      <img
        class="climb-card__sign-torch"
        :class="{ 'climb-card__torch--lit': signTorchLit }"
        :style="{ left: `${SIGN_TORCH.left}%`, top: `${SIGN_TORCH.top}%` }"
        :src="signTorchLit ? signTorchOn : signTorchOff"
        alt=""
      />

      <img
        v-if="!unlocked"
        class="climb-card__lock"
        :style="{ left: `${LOCK_SIGN.left}%`, top: `${LOCK_SIGN.top}%` }"
        :src="lockSignImage"
        alt="아직 잠겨 있어요"
      />

      <div class="climb-card__climber" :style="climberPosition">
        <span class="climb-card__climber-label">나 {{ progress }}%</span>
        <img class="climb-card__climber-img" :src="climberImage" alt="" />
      </div>
    </div>

    <BaseCard class="climb-card__body">
      <div class="climb-card__status">
        <span>정상까지 {{ 100 - climb.progressPercent }}% 남음</span>
        <span class="climb-card__increase">+{{ formatWon(climb.recentIncreaseAmount) }}</span>
      </div>

      <button type="button" class="climb-card__goal-summary" @click="$emit('view-goal')">
        <div class="climb-card__goal-summary-top">
          <span class="climb-card__goal-title">▲ {{ goalTitle }}</span>
          <span class="climb-card__goal-detail-link">자세히 ▷</span>
        </div>
        <p class="climb-card__goal-remaining">
          정상까지 {{ formatWon(climb.remainingAmount) }} · ETA {{ targetEta }}
        </p>
        <div class="climb-card__segments">
          <span
            v-for="(state, i) in segments"
            :key="i"
            class="climb-card__segment"
            :class="`climb-card__segment--${state}`"
          />
          <span class="climb-card__percent">{{ progress }}%</span>
        </div>
      </button>
    </BaseCard>
  </div>
</template>

<style scoped>
.climb-progress-card {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── 일러스트 ─────────────────────────────────────────────── */

.climb-card__illustration {
  position: relative;
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
  등불·표지판은 배경 위에 얹는다. 배경에 그려 넣으면 끌 수가 없다.
  기준점(left/top)은 기둥 바닥이라 translate로 그 자리까지 끌어올린다.
  가로 값이 -50%가 아닌 건 기둥이 이미지 한가운데가 아니기 때문이다.
*/
/* 표지판 등불보다 작아야 해서 원본의 2/3 정도로 줄여 그린다. */
.climb-card__torch {
  position: absolute;
  width: 3.4%;
  transform: translate(-47.2%, -100%);
}

.climb-card__sign-torch {
  position: absolute;
  width: 8.37%;
  transform: translate(-21.9%, -100%);
}

/* 켜진 등불만 아주 약하게 깜빡인다. transform은 자리 잡는 데 쓰고 있어 밝기로 준다. */
.climb-card__torch--lit {
  animation: torch-flicker 0.8s steps(2, end) infinite alternate;
}

@keyframes torch-flicker {
  from {
    filter: brightness(1);
  }
  to {
    filter: brightness(1.18);
  }
}

.climb-card__lock {
  position: absolute;
  width: 15.81%;
  transform: translate(-50%, -50%);
}

/*
  폭은 (스프라이트 원본 폭 ÷ 1720) × 100 으로 준다. 배경과 같은 배율이어야
  픽셀 크기가 맞는다. 캐릭터 스프라이트가 88px이면 5.12%다.
  이름표는 nowrap이라 이 폭을 넘겨도 가운데를 기준으로 양쪽으로 삐져나온다.
*/
.climb-card__climber {
  position: absolute;
  width: 9%;
  /* 발끝이 길에 닿아야 해서 아래쪽을 기준으로 잡는다. */
  transform: translate(-50%, -100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  /* 달성률이 오르면 길을 따라 걸어 올라가는 것처럼 보인다. */
  transition:
    left 0.9s ease-in-out,
    top 0.9s ease-in-out;
}

.climb-card__climber-label {
  padding: 1px 5px;
  background: var(--color-card-highlight, #f7ffd1);
  border: 2px solid #1b2416;
  color: #1b2416;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  line-height: 1.4;
}

.climb-card__climber-img {
  width: 100%;
}

/* 화면 움직임을 꺼둔 사용자에게는 깜빡이지 않는다. */
@media (prefers-reduced-motion: reduce) {
  .climb-card__torch--lit {
    animation: none;
  }

  .climb-card__climber {
    transition: none;
  }
}

/* ── 아래 요약 카드 ────────────────────────────────────────── */

/*
  글자색 세 단계.
    --ink        목표 제목, 퍼센트          제일 진하게
    --ink-muted  보조 정보                  회녹색
    --accent     증가액                     게이지 채움색과 같은 초록

  opacity 대신 색을 직접 준다. 투명도로 흐리게 하면 배경색이 바뀔 때 같이 흔들린다.
*/
.climb-card__body {
  --ink: #12281c;
  --ink-muted: #6f8b79;
  --accent: var(--color-progress-fill, #1d6b3f);

  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--color-mint-pale, #cdedd3);
  border-radius: 0 0 16px 16px;
  /*
    루트의 145%는 18px 기준으로 계산된 26.1px이 그대로 상속된다. 여기 글자는 11~15px이라
    줄 사이가 과하게 벌어진다. 단위 없는 값으로 덮어써야 각 글자 크기에 맞춰 계산된다.
  */
  line-height: 1.35;
}

.climb-card__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* 목표 요약과 나누는 점선. 색 블록을 하나 더 두는 것보다 가볍다. */
  padding-bottom: 8px;
  border-bottom: 2px dashed #a9c6af;
  font-size: 12px;
  color: var(--ink-muted);
}

/* 늘어난 금액은 게이지 채움색과 같은 초록. 좋은 소식이라 눈에 걸려야 한다. */
.climb-card__increase {
  color: var(--accent);
  font-weight: 700;
}

.climb-card__goal-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  /* 브라우저가 button에 기본 좌우 여백을 준다. 안 지우면 점선 위 글자보다 안쪽으로 밀린다. */
  padding: 0;
  border: none;
  background: transparent;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

/* 이 카드에서 제일 큰 글자. 목표가 무엇인지가 한눈에 들어와야 한다. */
.climb-card__goal-summary-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
}

.climb-card__goal-detail-link {
  flex: none;
  font-size: 11.5px;
  font-weight: 400;
  color: var(--ink-muted);
}

/*
  p의 기본 위아래 여백(1em)이 살아 있으면 gap 위에 한 줄이 더 붙는다.
  점선 아래만 한 칸 띄운 것처럼 보이던 원인이다.
*/
.climb-card__goal-remaining {
  margin: 0;
  font-size: 11px;
  color: var(--ink-muted);
}

/* 퍼센트를 게이지 오른쪽 끝에 붙인다. 아래에 따로 두면 줄만 하나 늘어난다. */
.climb-card__segments {
  display: flex;
  align-items: center;
  gap: 4px;
}

.climb-card__segment {
  flex: 1;
  height: 13px;
  border-radius: 4px;
}

.climb-card__segment--empty {
  background: #a9c6af;
}

.climb-card__segment--filled {
  background: var(--color-progress-fill, #1d6b3f);
}

/* 채우는 중인 한 칸. 등불과 같은 노랑이라 "지금 여기"로 읽힌다. */
.climb-card__segment--current {
  background: #ffd939;
}

.climb-card__percent {
  flex: none;
  margin-left: 5px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
</style>
