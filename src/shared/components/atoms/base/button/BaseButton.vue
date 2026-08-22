<script setup>
defineProps({
  type: { type: String, default: 'button' },
  // primary/secondary/highlight/dark: 기존 색상 그대로.
  // text: 배경 없는 이동/보조 액션("자세히 ›" 등)용.
  variant: { type: String, default: 'primary' },
  // lg(Default, 50~52px/16~18px radius): 화면 하단 Primary/Secondary CTA.
  // md(Compact, 44~48px): 카드 내부 action.
  size: { type: String, default: 'lg' },
  disabled: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  font-family: inherit;
  cursor: pointer;
}

/*
  버튼 높이는 두 단계로만 둔다(Default/Compact). 화면마다 46px/49px/53px/56px처럼
  애매하게 다른 값을 새로 만들지 않는다. 예전엔 lg(53px/15px radius)와 modal(50px/14px
  radius)이 사실상 같은 용도(화면 하단 CTA)로 미세하게만 달랐어서 하나로 합쳤다 —
  modal 전용 사이즈였던 곳들은 이제 기본값(lg)을 그대로 쓴다.
*/
.base-button--lg {
  width: 100%;
  height: 51px;
  padding: 0 20px;
  border-radius: 17px;
  font-size: 16px;
  font-weight: 700;
}

/* Compact. Quest CTA와 카드 내부 action이 공유한다 — pill 여부는 variant(quest)가 정하고,
   여기서는 높이/여백/기본 radius(둥근 사각형)만 정한다. */
.base-button--md {
  width: auto;
  height: 46px;
  padding: 0 16px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
}

.base-button--primary {
  background: var(--base-button-primary-bg, #e3ffe8);
  color: var(--base-button-primary-text, #16281c);
}

.base-button--secondary {
  background: var(--color-surface, #2a2a2a);
  color: var(--color-text-primary, #e3ffe8);
}

.base-button--highlight {
  background: var(--color-text-primary, #f7ffd1);
  color: var(--color-app-bg, #111111);
}

.base-button--dark {
  background: var(--color-mint-deep, #16281c);
  color: var(--color-card-highlight, #f7ffd1);
}

/*
  배경 없는 이동/보조 액션("자세히 ›", "다른 계획 비교하기" 등). 카드 CTA와 혼동되지
  않도록 lg/md의 고정 폭·높이·radius를 모두 지우고 내용 크기만큼만 차지하게 한다.
*/
.base-button--text {
  width: auto;
  height: auto;
  padding: 4px;
  border-radius: 0;
  background: none;
  color: var(--color-text-tertiary, #8f968c);
  font-size: 13px;
  font-weight: 700;
  gap: 2px;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
