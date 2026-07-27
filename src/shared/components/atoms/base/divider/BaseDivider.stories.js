import BaseDivider from './BaseDivider.vue'

export default {
  title: 'Atoms/Base/Divider',
  component: BaseDivider,
  tags: ['autodocs'],
}

export const Default = {
  render: () => ({
    components: { BaseDivider },
    template: `
      <div>
        <p style="margin: 0 0 12px;">위 영역</p>
        <BaseDivider />
        <p style="margin: 12px 0 0;">아래 영역</p>
      </div>
    `,
  }),
}
