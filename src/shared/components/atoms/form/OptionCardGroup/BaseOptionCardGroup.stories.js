import { ref } from 'vue'
import { fn } from 'storybook/test'

import BaseOptionCardGroup from './BaseOptionCardGroup.vue'

const incomeBracketOptions = [
  { value: 1, label: '1분위', sublabel: '하위 10%' },
  { value: 2, label: '2~3분위', sublabel: '하위 10~30%' },
  { value: 3, label: '4~5분위', sublabel: '중위 30~50%' },
  { value: 4, label: '6~7분위', sublabel: '중위 50~70%' },
  { value: 5, label: '8~9분위', sublabel: '상위 30%' },
  { value: 6, label: '10분위', sublabel: '상위 10%' },
]

export default {
  title: 'Atoms/Form/OptionCardGroup',
  component: BaseOptionCardGroup,
  tags: ['autodocs'],
  args: {
    options: incomeBracketOptions,
    modelValue: 3,
    'onUpdate:modelValue': fn(),
  },
  render: (args) => ({
    components: { BaseOptionCardGroup },
    setup() {
      const value = ref(args.modelValue)

      function handleUpdate(nextValue) {
        value.value = nextValue
        args['onUpdate:modelValue'](nextValue)
      }

      return { args, value, handleUpdate }
    },
    template: `
      <BaseOptionCardGroup
        :options="args.options"
        :model-value="value"
        @update:model-value="handleUpdate"
      />
    `,
  }),
}

export const IncomeBracket = {}
