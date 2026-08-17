<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import MobileContainer from '@/shared/components/molecules/MobileContainer.vue'
import BaseBottomNav from '@/shared/components/atoms/navigation/BottomNav/BaseBottomNav.vue'
import {
  HomeIcon,
  GoalIcon,
  PolicyIcon as CompareIcon,
  MyIcon,
} from '@/shared/components/atoms/navigation/BottomNav/icons'
import { fetchGoalSummary } from '@/features/goal/api/goalApi'

const route = useRoute()
const router = useRouter()

// 목표 탭은 goalId가 있어야 이동 가능한 동적 경로라 고정 path(to) 대신,
// 활성 목표 존재 여부에 따라 이동할 라우트 이름(matchNames)으로 활성 탭을 판정한다.
const navItems = [
  { label: '홈', icon: HomeIcon, to: '/home' },
  { label: '목표', icon: GoalIcon, matchNames: ['goal-detail', 'goal-empty'] },
  { label: '비교', icon: CompareIcon, to: '/compare' },
  { label: '마이', icon: MyIcon, to: '/my' },
]

const HIDDEN_NAV_ROUTE_NAMES = [
  'diagnosis',
  'goal-recommendations',
  'goal-recommendation-detail',
  'edit-info',
  'asset-link-additional',
]

const activeIndex = computed(() =>
  navItems.findIndex((item) =>
    item.matchNames ? item.matchNames.includes(route.name) : route.path.startsWith(item.to),
  ),
)
const showNav = computed(() => route.path !== '/' && !HIDDEN_NAV_ROUTE_NAMES.includes(route.name))

// 활성 목표가 있으면 목표 상세로, 없으면 목표 설정을 안내하는 화면으로 보낸다
async function goToGoalTab() {
  try {
    const summary = await fetchGoalSummary()
    router.push({ name: 'goal-detail', params: { goalId: summary.goalId } })
  } catch {
    router.push({ name: 'goal-empty' })
  }
}

function handleTabChange(index) {
  const item = navItems[index]
  if (item.matchNames) {
    goToGoalTab()
    return
  }
  if (item.to !== route.path) router.push(item.to)
}
</script>

<template>
  <MobileContainer full-height>
    <main class="mobile-layout__content" :class="{ 'mobile-layout__content--no-nav': !showNav }">
      <RouterView />
    </main>
    <nav v-if="showNav" class="mobile-layout__nav">
      <BaseBottomNav
        :items="navItems"
        :model-value="activeIndex"
        @update:model-value="handleTabChange"
      />
    </nav>
  </MobileContainer>
</template>

<style scoped>
.mobile-layout__content {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 16px 16px 96px;
}

.mobile-layout__content--no-nav {
  padding-bottom: 16px;
}

.mobile-layout__nav {
  position: fixed;
  z-index: 10;
  bottom: 12px;
  left: 50%;
  width: calc(100% - 32px);
  max-width: 368px;
  transform: translateX(-50%);
}
</style>
