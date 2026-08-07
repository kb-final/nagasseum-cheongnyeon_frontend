<script setup>
defineProps({
  eyebrow: { type: String, required: true },
  variant: { type: String, default: 'default' }, // 'default' | 'wait'
  title: { type: String, required: true },
})
</script>

<template>
  <div class="state-card">
    <span class="state-card__eyebrow" :class="{ 'state-card__eyebrow--wait': variant === 'wait' }">
      {{ eyebrow }}
    </span>
    <p class="state-card__title">{{ title }}</p>
    <div class="state-card__body"><slot /></div>
    <div v-if="$slots.action" class="state-card__action"><slot name="action" /></div>
  </div>
</template>

<style scoped>
.state-card {
  border-radius: 18px;
  background: var(--card-bg, #161616);
  border: 1px solid var(--border);
  padding: 16px;
}

.state-card__eyebrow {
  display: inline-flex;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(193, 68, 46, 0.16);
  color: #e37a63;
  font-size: 10px;
  font-weight: 600;
  margin-bottom: 9px;
}

.state-card__eyebrow--wait {
  background: rgba(255, 217, 57, 0.16);
  color: #ffd939;
}

.state-card__title {
  margin: 0 0 5px;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-h);
}

.state-card__body {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--text);
}

.state-card__action {
  margin-top: 12px;
}
</style>
