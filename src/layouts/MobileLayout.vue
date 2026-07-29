<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseBottomNav from '@/shared/components/atoms/navigation/BottomNav/BaseBottomNav.vue'
import {
  HomeIcon,
  GoalIcon as CompareIcon,
  PolicyIcon,
  MyIcon,
} from '@/shared/components/atoms/navigation/BottomNav/icons'

const route = useRoute()
const router = useRouter()

// 비교/정책/마이 화면은 아직 라우트가 없어서 클릭해도 빈 화면만 뜬다(추후 도메인 추가 시 자연스럽게 연결됨)
const navItems = [
  { label: '홈', icon: HomeIcon, to: '/home' },
  { label: '비교', icon: CompareIcon, to: '/goal' },
  { label: '정책', icon: PolicyIcon, to: '/policy' },
  { label: '마이', icon: MyIcon, to: '/my' },
]

const activeIndex = computed(() => navItems.findIndex((item) => route.path.startsWith(item.to)))

function handleTabChange(index) {
  const target = navItems[index].to
  if (target !== route.path) router.push(target)
}
</script>

<template>
  <div class="mobile-layout">
    <main class="mobile-layout__content">
      <RouterView />
    </main>
    <nav v-if="route.path !== '/'" class="mobile-layout__nav">
      <BaseBottomNav
        :items="navItems"
        :model-value="activeIndex"
        @update:model-value="handleTabChange"
      />
    </nav>
  </div>
</template>

<style scoped>
.mobile-layout {
  position: relative;
  width: 100%;
  max-width: 400px;
  min-height: 100vh;
  margin: 0 auto;
  background: var(--bg, #111111);
}

.mobile-layout__content {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 16px 16px 96px;
}

.mobile-layout__nav {
  position: fixed;
  bottom: 12px;
  left: 50%;
  width: calc(100% - 32px);
  max-width: 368px;
  transform: translateX(-50%);
}
</style>
