<script setup>
import { useRouter } from 'vue-router'

import AppHeader from '@/shared/components/molecules/AppHeader.vue'
import EmptyGoalCard from '@/features/home/components/EmptyGoalCard.vue'

const router = useRouter()
</script>

<template>
  <div class="goal-empty-view">
    <AppHeader title="목표" :show-back="false" />
    <EmptyGoalCard @create-goal="router.push('/diagnosis')" />
  </div>
</template>

<style scoped>
.goal-empty-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
