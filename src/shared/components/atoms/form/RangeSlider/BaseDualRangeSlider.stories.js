import { ref } from 'vue'

import BaseDualRangeSlider from './BaseDualRangeSlider.vue'

export default {
  title: 'Atoms/Form/RangeSlider',
  component: BaseDualRangeSlider,
  tags: ['autodocs'],
  args: {
    label: '희망 평수',
    min: 0,
    max: 50,
    step: 1,
    modelValue: { min: 10, max: 20 },
    formatValue: (v) => `${v}평`,
  },
  render: (args) => ({
    components: { BaseDualRangeSlider },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `
      <div style="width: 400px;">
        <BaseDualRangeSlider
          :label="args.label"
          :min="args.min"
          :max="args.max"
          :step="args.step"
          :format-value="args.formatValue"
          v-model="value"
        />
      </div>
    `,
  }),
}

export const Default = {}

export const Deposit = {
  args: {
    label: '희망 보증금',
    min: 0,
    max: 100000,
    step: 1000,
    modelValue: { min: 30000, max: 60000 },
    formatValue: (v) => `${(v / 10000).toFixed(0)}억`,
  },
}
