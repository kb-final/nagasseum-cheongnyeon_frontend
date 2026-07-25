import { fn } from 'storybook/test'

import BaseButton from './BaseButton.vue'

export default {
  title: 'Atoms/Base/Button',
  component: BaseButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    size: { control: 'select', options: ['modal', 'md', 'lg'] },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
  },
  args: {
    variant: 'primary',
    size: 'lg',
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
      <BaseButton :type="args.type" :variant="args.variant" :size="args.size" :disabled="args.disabled" @click="args.onClick">
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

export const Medium = {
  render: () => ({
    components: { BaseButton },
    setup() {
      return { onClick: fn() }
    },
    template: `
      <div style="display: flex; gap: 8px; width: 320px;">
        <BaseButton variant="secondary" size="md" @click="onClick">취소</BaseButton>
        <BaseButton variant="primary" size="md" @click="onClick">다음</BaseButton>
      </div>
    `,
  }),
}

export const ModalActions = {
  render: () => ({
    components: { BaseButton },
    setup() {
      return { onClick: fn() }
    },
    template: `
      <div style="display: flex; gap: 8px; width: 320px;">
        <BaseButton variant="secondary" size="modal" @click="onClick">취소</BaseButton>
        <BaseButton variant="primary" size="modal" @click="onClick">확인</BaseButton>
      </div>
    `,
  }),
}

export const Disabled = {
  args: { disabled: true, label: '비활성' },
}
