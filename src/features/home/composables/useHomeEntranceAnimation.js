// 모듈 스코프라 앱이 켜져 있는 동안 딱 한 번만 true다.
// 목표/비교 화면을 오가며 홈에 다시 들어와도(컴포넌트가 다시 mount돼도) 재생되지 않는다.
let hasEnteredHome = false

export function useHomeEntranceAnimation() {
  const shouldAnimate = !hasEnteredHome
  hasEnteredHome = true
  return shouldAnimate
}
