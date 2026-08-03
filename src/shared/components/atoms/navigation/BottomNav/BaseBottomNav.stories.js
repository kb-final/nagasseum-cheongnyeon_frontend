import { ref } from 'vue'

import BaseBottomNav from './BaseBottomNav.vue'
import { HomeIcon, GoalIcon, PolicyIcon, MyIcon } from './icons'

const items = [
  { label: '홈', icon: HomeIcon },
  { label: '목표', icon: GoalIcon },
  { label: '정책', icon: PolicyIcon },
  { label: '마이', icon: MyIcon },
]

export default {
  title: 'Atoms/Navigation/BottomNav',
  component: BaseBottomNav,
  tags: ['autodocs'],
  args: {
    items,
    modelValue: 0,
  },
  render: (args) => ({
    components: { BaseBottomNav },
    setup() {
      const active = ref(args.modelValue)
      return { args, active }
    },
    template: `
      <div style="width: 360px;">
        <BaseBottomNav :items="args.items" v-model="active" />
      </div>
    `,
  }),
}

export const Default = {}

export const SecondTabActive = {
  args: { modelValue: 1 },
}
