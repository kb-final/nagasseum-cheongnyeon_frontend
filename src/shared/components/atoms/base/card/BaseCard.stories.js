import BaseCard from './BaseCard.vue'

export default {
  title: 'Atoms/Base/Card',
  component: BaseCard,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['lg', 'modal'] },
  },
  args: {
    size: 'lg',
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard :size="args.size">
        <p style="margin: 0;">카드 안에 들어가는 정보 영역입니다.</p>
      </BaseCard>
    `,
  }),
}

export const Default = {}
