import BaseSkeleton from './BaseSkeleton.vue'

export default {
  title: 'Atoms/Feedback/Skeleton',
  component: BaseSkeleton,
  tags: ['autodocs'],
  args: {
    width: '100%',
    height: '16px',
    radius: '8px',
  },
  render: (args) => ({
    components: { BaseSkeleton },
    setup() {
      return { args }
    },
    template: `<BaseSkeleton :width="args.width" :height="args.height" :radius="args.radius" />`,
  }),
}

export const Default = {}

export const CardPlaceholder = {
  render: () => ({
    components: { BaseSkeleton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; width: 320px;">
        <BaseSkeleton height="80px" radius="16px" />
        <BaseSkeleton width="60%" height="14px" />
        <BaseSkeleton width="40%" height="14px" />
      </div>
    `,
  }),
}
