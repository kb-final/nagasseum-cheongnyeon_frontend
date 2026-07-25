import { ref } from 'vue'
import { fn } from 'storybook/test'

import BaseInput from './BaseInput.vue'

export default {
  title: 'Atoms/Base/Input',
  component: BaseInput,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'password', 'number', 'email'] },
    size: { control: 'select', options: ['default', 'sm'] },
  },
  args: {
    modelValue: '',
    type: 'text',
    placeholder: '입력해주세요',
    size: 'default',
    'onUpdate:modelValue': fn(),
  },
  render: (args) => ({
    components: { BaseInput },
    setup() {
      const value = ref(args.modelValue)

      function handleUpdate(nextValue) {
        value.value = nextValue
        args['onUpdate:modelValue'](nextValue)
      }

      return { args, value, handleUpdate }
    },
    template: `
      <BaseInput
        :model-value="value"
        :type="args.type"
        :placeholder="args.placeholder"
        :size="args.size"
        @update:model-value="handleUpdate"
      />
    `,
  }),
}

export const Default = {}

export const WithValue = {
  args: { modelValue: '홍길동' },
}

export const Password = {
  args: { type: 'password', placeholder: '비밀번호' },
}

export const Small = {
  args: { size: 'sm', placeholder: '나이' },
}
