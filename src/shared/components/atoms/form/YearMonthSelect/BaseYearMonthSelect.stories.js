import { ref } from 'vue'

import BaseYearMonthSelect from './BaseYearMonthSelect.vue'

export default {
  title: 'Atoms/Form/YearMonthSelect',
  component: BaseYearMonthSelect,
  tags: ['autodocs'],
  args: {
    label: '목표 시점',
    modelValue: '2028-09',
  },
  render: (args) => ({
    components: { BaseYearMonthSelect },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `
      <div style="width: 400px;">
        <BaseYearMonthSelect :label="args.label" v-model="value" />
      </div>
    `,
  }),
}

export const Default = {}
