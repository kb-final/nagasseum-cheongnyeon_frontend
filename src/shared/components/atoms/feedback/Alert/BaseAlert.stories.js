import BaseAlert from './BaseAlert.vue'

export default {
  title: 'Atoms/Feedback/Alert',
  component: BaseAlert,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'error'] },
  },
  args: {
    variant: 'info',
  },
  render: (args) => ({
    components: { BaseAlert },
    setup() {
      return { args }
    },
    template: `<BaseAlert :variant="args.variant">안내 메시지입니다.</BaseAlert>`,
  }),
}

export const Info = {
  args: { variant: 'info' },
}

export const Success = {
  render: () => ({
    components: { BaseAlert },
    template: `<BaseAlert variant="success">저장되었습니다.</BaseAlert>`,
  }),
}

export const Error = {
  render: () => ({
    components: { BaseAlert },
    template: `<BaseAlert variant="error">오류가 발생했습니다.</BaseAlert>`,
  }),
}
