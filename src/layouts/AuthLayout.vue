<script setup>
import MobileContainer from '@/shared/components/molecules/MobileContainer.vue'
</script>

<template>
  <div class="auth-layout">
    <MobileContainer>
      <RouterView />
    </MobileContainer>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
