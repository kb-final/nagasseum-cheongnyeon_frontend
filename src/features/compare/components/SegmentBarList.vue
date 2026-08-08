<script setup>
import { computed } from 'vue'

const SEGMENT_COUNT = 10

const props = defineProps({
  items: { type: Array, required: true },
})

const rows = computed(() =>
  props.items.map((item) => ({ ...item, filled: Math.round((item.ratio / 100) * SEGMENT_COUNT) })),
)
</script>

<template>
  <div class="bar-list">
    <div
      v-for="(item, rowIndex) in rows"
      :key="item.key"
      class="bar-row"
      :style="{ '--row': rowIndex }"
    >
      <div class="bar-row__head">
        <span class="bar-row__label">{{ item.label }}</span>
        <span v-if="item.badge" class="bar-row__badge">{{ item.badge }}</span>
        <span class="bar-row__value">{{ item.ratio }}%</span>
      </div>
      <div
        class="bar-row__track"
        :class="{ 'bar-row__track--highlight': item.highlighted }"
        aria-hidden="true"
      >
        <span
          v-for="n in SEGMENT_COUNT"
          :key="n"
          class="bar-row__segment"
          :class="{ 'bar-row__segment--on': n <= item.filled }"
          :style="{ '--i': n }"
        ></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bar-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.bar-row__head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.bar-row__badge {
  display: inline-flex;
  align-items: center;
  height: 12px;
  border-radius: 999px;
  padding: 0 5px;
  background: var(--badge, #ffd939);
  color: #171b16;
  font-size: 10px;
  line-height: 1;
}

.bar-row__value {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
}

.bar-row__track {
  display: flex;
  gap: 3px;
  margin-top: 4px;
}

.bar-row__segment {
  flex: 1;
  height: 12px;
  border-radius: 3px;
  background: var(--segment);
}

.bar-row__segment--on {
  background: var(--segment-on);
  animation: segment-rise 0.26s ease-out both;
  animation-delay: calc(var(--row, 0) * 90ms + (var(--i, 1) - 1) * 45ms);
}

.bar-row__track--highlight .bar-row__segment--on {
  background: var(--segment-on-highlight);
}

@keyframes segment-rise {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
