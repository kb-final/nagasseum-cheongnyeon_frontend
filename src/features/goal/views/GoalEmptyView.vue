<script setup>
import { useRouter } from 'vue-router'

import EmptyGoalCard from '@/features/home/components/EmptyGoalCard.vue'

const router = useRouter()
</script>

<template>
  <div class="goal-empty-view">
    <header class="goal-empty-view__header">
      <h1>목표</h1>
    </header>
    <EmptyGoalCard @create-goal="router.push('/diagnosis')" />
  </div>
</template>

<style scoped>
.goal-empty-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.goal-empty-view__header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-h, #ffffff);
}
</style>
