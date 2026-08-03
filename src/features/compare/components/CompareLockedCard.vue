<script setup>
import lockedImage from '@/features/compare/assets/locked.png'
</script>

<template>
  <section class="locked">
    <div class="locked__art">
      <span class="locked__line"></span>
      <span class="locked__line"></span>
      <span class="locked__line"></span>
      <span class="locked__lock"><img :src="lockedImage" alt="" /></span>
    </div>

    <span class="locked__badge">LOCKED</span>
    <h2 class="locked__title">아직 비교할 수 없어요</h2>

    <p class="locked__body">
      다른 사용자의 목표를 조회하고 싶으시다면 마이페이지에서<br />
      <b>"목표 비교 데이터 제공"</b> 약관에 동의해주시기 바랍니다.
    </p>

    <div class="locked__info">
      <p class="locked__info-title"><span class="locked__dot"></span>왜 동의가 필요한가요?</p>
      <ul class="locked__info-list">
        <li>내 익명화된 목표 데이터를 함께 제공하고</li>
        <li>비슷한 자산의 사용자 데이터를 볼 수 있어요</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* 폰트 크기는 rem이 아닌 px로 고정한다.
   루트가 18px/16px로 바뀌면 픽셀 폰트가 그리드에서 어긋나 뭉개진다. */
.locked {
  /* 이 화면에서만 쓰는 색 */
  --badge: #ffd939;
  --on-pale: #556057;

  /* 잠금 일러스트 전용 색 */
  --art-face: #2b312c;
  --art-line: #7f8a7d;
  --art-lock: #9fd8ab;
  --art-gap: #111511;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0 0;
  text-align: center;
  /* 루트의 145%는 18px 기준으로 계산된 26.1px이 그대로 상속된다.
     단위 없는 값으로 덮어써야 각 요소가 제 폰트 크기로 줄 높이를 계산한다. */
  line-height: 1.45;
}

/* 바깥 원만 둥글다. 안쪽 막대는 각지게 둔다. */
.locked__art {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--art-face);
}

.locked__line {
  position: absolute;
  left: 30px;
  height: 10px;
  background: var(--art-line);
}

.locked__line:nth-of-type(1) {
  top: 40px;
  width: 60px;
}

.locked__line:nth-of-type(2) {
  top: 58px;
  width: 46px;
}

.locked__line:nth-of-type(3) {
  top: 76px;
  width: 54px;
}

/* 원 테두리를 파고드는 배지. 바깥 여백은 배경색으로 원을 파낸 것처럼 보이게 한다. */
.locked__lock {
  position: absolute;
  top: 73px;
  left: 73px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 4px solid var(--art-gap);
  background: var(--art-lock);
  box-sizing: border-box;
}

/* 원본이 11px이라 등배로 키워야 픽셀이 고르게 나온다. */
.locked__lock img {
  width: 17px;
  height: 17px;
  image-rendering: pixelated;
}

.locked__badge {
  margin-top: 16px;
  border: 1px solid var(--badge);
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--badge);
}

.locked__title {
  margin: 10px 0 0;
  font-size: 17px;
  color: var(--text-h);
}

.locked__body {
  margin: 20px 0 0;
  font-size: 12px;
  line-height: 1.7;
  color: var(--text);
}

.locked__body b {
  font-weight: inherit;
  color: var(--text-h);
}

.locked__info {
  width: 100%;
  margin-top: 32px;
  border-radius: 12px;
  padding: 14px 16px;
  background: var(--accent);
  text-align: left;
  color: var(--on-pale);
}

.locked__info-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 8px;
  font-size: 12px;
}

.locked__dot {
  flex: none;
  width: 8px;
  height: 8px;
  background: currentColor;
}

.locked__info-list {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 11px;
}

.locked__info-list li {
  display: flex;
  gap: 6px;
}

.locked__info-list li + li {
  margin-top: 4px;
}

.locked__info-list li::before {
  content: '·';
}
</style>
