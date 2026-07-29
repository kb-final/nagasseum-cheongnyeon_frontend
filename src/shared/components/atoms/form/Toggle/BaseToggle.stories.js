import { ref } from 'vue'
import { fn } from 'storybook/test'

import BaseToggle from './BaseToggle.vue'

export default {
  title: 'Atoms/Form/Toggle',
  component: BaseToggle,
  tags: ['autodocs'],
  args: {
    modelValue: false,
    'onUpdate:modelValue': fn(),
  },
  render: (args) => ({
    components: { BaseToggle },
    setup() {
      const value = ref(args.modelValue)

      function handleUpdate(nextValue) {
        value.value = nextValue
        args['onUpdate:modelValue'](nextValue)
      }

      return { args, value, handleUpdate }
    },
    template: `<BaseToggle :model-value="value" @update:model-value="handleUpdate" />`,
  }),
}

export const Off = {
  args: { modelValue: false },
}

export const On = {
  args: { modelValue: true },
}
