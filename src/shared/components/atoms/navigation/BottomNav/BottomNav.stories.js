import { ref } from 'vue'

import BottomNav from './BottomNav.vue'

const HomeIcon = {
  template: `
    <svg viewBox="0 0 17 17" fill="none">
      <path d="M2 8L8.5 2.5L15 8V15H10.5V10.5H6.5V15H2V8Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
    </svg>
  `,
}

const GoalIcon = {
  template: `
    <svg viewBox="0 0 17 17" fill="none">
      <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" stroke-width="1.4" />
      <circle cx="8.5" cy="8.5" r="3" stroke="currentColor" stroke-width="1.4" />
      <circle cx="8.5" cy="8.5" r="0.8" fill="currentColor" />
    </svg>
  `,
}

const PolicyIcon = {
  template: `
    <svg viewBox="0 0 17 17" fill="none">
      <rect x="3" y="2" width="11" height="13" rx="1.5" stroke="currentColor" stroke-width="1.4" />
      <path d="M6 6H11M6 9H11M6 12H9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
    </svg>
  `,
}

const MyIcon = {
  template: `
    <svg viewBox="0 0 17 17" fill="none">
      <circle cx="8.5" cy="6" r="3" stroke="currentColor" stroke-width="1.4" />
      <path d="M2.5 15C2.5 11.5 5.2 10 8.5 10C11.8 10 14.5 11.5 14.5 15" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
    </svg>
  `,
}

const items = [
  { label: '홈', icon: HomeIcon },
  { label: '목표', icon: GoalIcon },
  { label: '정책', icon: PolicyIcon },
  { label: '마이', icon: MyIcon },
]

export default {
  title: 'Atoms/Navigation/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  args: {
    items,
    modelValue: 0,
  },
  render: (args) => ({
    components: { BottomNav },
    setup() {
      const active = ref(args.modelValue)
      return { args, active }
    },
    template: `
      <div style="width: 360px;">
        <BottomNav :items="args.items" v-model="active" />
      </div>
    `,
  }),
}

export const Default = {}

export const SecondTabActive = {
  args: { modelValue: 1 },
}
