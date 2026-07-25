import Skeleton from './Skeleton.vue'

export default {
  title: 'Atoms/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    width: '100%',
    height: '16px',
    radius: '8px',
  },
  render: (args) => ({
    components: { Skeleton },
    setup() {
      return { args }
    },
    template: `<Skeleton :width="args.width" :height="args.height" :radius="args.radius" />`,
  }),
}

export const Default = {}

export const CardPlaceholder = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; width: 320px;">
        <Skeleton height="80px" radius="16px" />
        <Skeleton width="60%" height="14px" />
        <Skeleton width="40%" height="14px" />
      </div>
    `,
  }),
}
