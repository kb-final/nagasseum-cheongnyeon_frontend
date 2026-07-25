<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="base-modal-overlay"
      @click.self="$emit('update:modelValue', false)"
    >
      <div class="base-modal">
        <header v-if="title" class="base-modal__header">
          <h2>{{ title }}</h2>
        </header>
        <div class="base-modal__body">
          <slot />
        </div>
        <footer class="base-modal__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.base-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.base-modal {
  background: var(--bg, #fff);
  border-radius: 22px;
  padding: 24px;
  min-width: 320px;
  max-width: 90vw;
}

.base-modal__footer {
  display: flex;
  gap: 10px;
}
</style>
