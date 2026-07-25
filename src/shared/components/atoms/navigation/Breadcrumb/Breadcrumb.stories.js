import Breadcrumb from './Breadcrumb.vue'

const steps = [{ label: '로그인' }, { label: '내 정보 설정' }, { label: '자산 연동' }]

export default {
  title: 'Atoms/Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {
    steps,
    current: 2,
  },
  render: (args) => ({
    components: { Breadcrumb },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 360px;">
        <Breadcrumb :steps="args.steps" :current="args.current" />
      </div>
    `,
  }),
}

export const Default = {}

export const FirstStep = {
  args: { current: 1 },
}

export const LastStep = {
  args: { current: 3 },
}
