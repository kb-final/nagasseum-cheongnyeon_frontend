import { ref } from 'vue'
import { fn } from 'storybook/test'

import BaseInputField from './BaseInputField.vue'

export default {
  title: 'Molecules/BaseInputField',
  component: BaseInputField,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'password', 'number', 'email'] },
  },
  args: {
    modelValue: '',
    label: '닉네임',
    required: true,
    type: 'text',
    placeholder: '2~12자 한글·영문·숫자',
    'onUpdate:modelValue': fn(),
  },
  render: (args) => ({
    components: { BaseInputField },
    setup() {
      const value = ref(args.modelValue)

      function handleUpdate(nextValue) {
        value.value = nextValue
        args['onUpdate:modelValue'](nextValue)
      }

      return { args, value, handleUpdate }
    },
    template: `
      <BaseInputField
        :model-value="value"
        :label="args.label"
        :required="args.required"
        :type="args.type"
        :placeholder="args.placeholder"
        @update:model-value="handleUpdate"
      />
    `,
  }),
}

export const Required = {}

export const Optional = {
  args: { label: '소득분위', required: false, placeholder: '소득 분위 입력' },
}
