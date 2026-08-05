<script setup>
import BaseCard from '@/shared/components/atoms/base/card/BaseCard.vue'
import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'

defineEmits(['link-asset'])
</script>

<template>
  <BaseCard class="empty-asset-card">
    <p class="empty-asset-card__heading">연동된 자산이 없어요</p>
    <p class="empty-asset-card__desc">금융기관을 연동하면 자산 현황을 한눈에 볼 수 있어요</p>
    <BaseButton variant="primary" size="lg" @click="$emit('link-asset')">자산 연동하기</BaseButton>
  </BaseCard>
</template>

<style scoped>
.empty-asset-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 20px 24px;
  text-align: center;
  background: var(--color-card-highlight, #f7ffd1);
}

.empty-asset-card__heading {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-mint-deep, #16281c);
}

.empty-asset-card__desc {
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-mint-deep, #16281c);
  opacity: 0.7;
}
</style>
