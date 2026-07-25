import Alert from './Alert.vue'

export default {
  title: 'Atoms/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'error'] },
  },
  args: {
    variant: 'info',
  },
  render: (args) => ({
    components: { Alert },
    setup() {
      return { args }
    },
    template: `<Alert :variant="args.variant">안내 메시지입니다.</Alert>`,
  }),
}

export const Info = {
  args: { variant: 'info' },
}

export const Success = {
  render: () => ({
    components: { Alert },
    template: `<Alert variant="success">저장되었습니다.</Alert>`,
  }),
}

export const Error = {
  render: () => ({
    components: { Alert },
    template: `<Alert variant="error">오류가 발생했습니다.</Alert>`,
  }),
}
