import { h } from 'vue'

import BaseEmptyState from '@/shared/components/atoms/feedback/EmptyState/BaseEmptyState.vue'

// 비교/정책/마이 화면은 아직 각자의 도메인이 만들어지지 않았다.
// 라우트를 아예 등록하지 않으면 MobileLayout(하단 네비바 포함)까지 통째로 언마운트되어
// 네비바가 사라지는 문제가 생기므로, 실제 도메인이 생기기 전까지는 빈 화면 placeholder로 등록해 둔다.
// 각 도메인이 만들어지면 이 파일에서 해당 라우트를 지우고 {domain}.routes.js 로 옮기면 된다.
function comingSoon(message) {
  return { render: () => h(BaseEmptyState, { message }) }
}

export const placeholderRoutes = [
  { path: 'goal', name: 'goal', component: comingSoon('비교 화면은 준비 중이에요') },
  { path: 'policy', name: 'policy', component: comingSoon('정책 화면은 준비 중이에요') },
  { path: 'my', name: 'my', component: comingSoon('마이 화면은 준비 중이에요') },
  // 진단 화면은 이번 스코프 밖이라, "+ 목표 설정하기" 버튼이 이동할 자리만 마련해 둔다
  { path: 'diagnosis', name: 'diagnosis', component: comingSoon('진단 화면은 준비 중이에요') },
]
