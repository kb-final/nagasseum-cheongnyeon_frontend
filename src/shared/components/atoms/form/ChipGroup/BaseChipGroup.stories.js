import { ref } from 'vue'

import BaseChipGroup from './BaseChipGroup.vue'

const housingOptions = [
  { label: '아파트', value: 'apartment' },
  { label: '오피스텔', value: 'officetel' },
  { label: '연립·다세대', value: 'multiplex' },
  { label: '단독·다가구', value: 'house' },
]

const dealOptions = [
  { label: '전세', value: 'jeonse' },
  { label: '월세', value: 'monthly' },
  { label: '매매', value: 'sale' },
]

export default {
  title: 'Atoms/Form/ChipGroup',
  component: BaseChipGroup,
  tags: ['autodocs'],
  args: {
    label: '주거 형태',
    options: housingOptions,
    modelValue: 'officetel',
  },
  render: (args) => ({
    components: { BaseChipGroup },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `
      <div style="width: 400px;">
        <BaseChipGroup :label="args.label" :options="args.options" v-model="value" />
      </div>
    `,
  }),
}

export const Default = {}

export const FilterForm = {
  render: () => ({
    components: { BaseChipGroup },
    setup() {
      const housing = ref('officetel')
      const deal = ref('jeonse')
      return { housing, deal, housingOptions, dealOptions }
    },
    template: `
      <div style="width: 400px; display: flex; flex-direction: column; gap: 40px;">
        <BaseChipGroup label="주거 형태" :options="housingOptions" v-model="housing" />
        <BaseChipGroup label="거래 유형" :options="dealOptions" v-model="deal" />
      </div>
    `,
  }),
}
