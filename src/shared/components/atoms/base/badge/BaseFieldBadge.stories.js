import BaseFieldBadge from './BaseFieldBadge.vue'

export default {
  title: 'Atoms/Base/Badge',
  component: BaseFieldBadge,
  tags: ['autodocs'],
  args: {
    required: true,
  },
  render: (args) => ({
    components: { BaseFieldBadge },
    setup() {
      return { args }
    },
    template: `<BaseFieldBadge :required="args.required" />`,
  }),
}

export const Required = {
  args: { required: true },
}

export const Optional = {
  args: { required: false },
}
