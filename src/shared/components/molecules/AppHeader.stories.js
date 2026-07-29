import { fn } from 'storybook/test'

import AppHeader from './AppHeader.vue'

export default {
  title: 'Molecules/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
  args: {
    title: '등반 준비',
    showBack: true,
    onBack: fn(),
  },
  render: (args) => ({
    components: { AppHeader },
    setup() {
      return { args }
    },
    template: `<AppHeader :title="args.title" :show-back="args.showBack" @back="args.onBack" />`,
  }),
}

export const Default = {}

export const WithoutBack = {
  args: { showBack: false },
}
