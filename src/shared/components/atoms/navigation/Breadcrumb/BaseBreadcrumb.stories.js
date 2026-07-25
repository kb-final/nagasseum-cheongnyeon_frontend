import BaseBreadcrumb from './BaseBreadcrumb.vue'

const steps = [{ label: '로그인' }, { label: '내 정보 설정' }, { label: '자산 연동' }]

export default {
  title: 'Atoms/Navigation/Breadcrumb',
  component: BaseBreadcrumb,
  tags: ['autodocs'],
  args: {
    steps,
    current: 2,
  },
  render: (args) => ({
    components: { BaseBreadcrumb },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 360px;">
        <BaseBreadcrumb :steps="args.steps" :current="args.current" />
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
