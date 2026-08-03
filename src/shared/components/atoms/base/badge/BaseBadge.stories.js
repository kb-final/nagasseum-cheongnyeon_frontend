import BaseBadge from './BaseBadge.vue'

export default {
  title: 'Atoms/Base/Badge/BaseBadge',
  component: BaseBadge,
  tags: ['autodocs'],
  args: {
    variant: 'neutral',
    default: 'D-19',
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: `<BaseBadge :variant="args.variant">{{ args.default }}</BaseBadge>`,
  }),
}

export const Point = {
  args: { variant: 'point', default: 'D-19' },
}

export const Mint = {
  args: { variant: 'mint', default: 'Lv.3 등반가' },
}

export const Neutral = {
  args: { variant: 'neutral', default: '상시' },
}

export const Outline = {
  args: { variant: 'outline', default: '상시' },
}

export const Quest = {
  args: { variant: 'quest', default: 'NEW QUEST' },
}
