import BaseEmptyState from './BaseEmptyState.vue'

export default {
  title: 'Atoms/Feedback/EmptyState',
  component: BaseEmptyState,
  tags: ['autodocs'],
  args: {
    message: '목표 화면은 준비 중이에요',
  },
  render: (args) => ({
    components: { BaseEmptyState },
    setup() {
      return { args }
    },
    template: `<BaseEmptyState :message="args.message" />`,
  }),
}

export const Default = {}
