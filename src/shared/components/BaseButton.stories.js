import { fn } from 'storybook/test'

import BaseButton from './BaseButton.vue'

export default {
  title: 'Shared/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
  },
  args: {
    variant: 'primary',
    type: 'button',
    disabled: false,
    label: '확인',
    onClick: fn(),
  },
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args }
    },
    template: `
      <BaseButton :type="args.type" :variant="args.variant" :disabled="args.disabled" @click="args.onClick">
        {{ args.label }}
      </BaseButton>
    `,
  }),
}

export const Primary = {
  args: { variant: 'primary', label: '확인' },
}

export const Secondary = {
  args: { variant: 'secondary', label: '취소' },
}

export const Disabled = {
  args: { disabled: true, label: '비활성' },
}
