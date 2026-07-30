import MobileContainer from './MobileContainer.vue'

export default {
  title: 'Molecules/MobileContainer',
  component: MobileContainer,
  tags: ['autodocs'],
  args: {
    fullHeight: false,
  },
  render: (args) => ({
    components: { MobileContainer },
    setup() {
      return { args }
    },
    template: `
      <MobileContainer :full-height="args.fullHeight" style="outline: 1px dashed #6e756f;">
        <div style="padding: 16px; color: #ffffff;">390~400px 모바일 폭으로 고정되는 공용 컨테이너</div>
      </MobileContainer>
    `,
  }),
}

export const Default = {}

export const FullHeight = {
  args: { fullHeight: true },
}
