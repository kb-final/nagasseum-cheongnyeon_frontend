import { ref } from 'vue'

import BaseButton from '../../base/button/BaseButton.vue'
import Toast from './Toast.vue'

export default {
  title: 'Atoms/Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'error'] },
  },
  args: {
    variant: 'info',
    duration: 3000,
  },
  render: (args) => ({
    components: { Toast, BaseButton },
    setup() {
      const visible = ref(false)
      return { args, visible }
    },
    template: `
      <div>
        <BaseButton @click="visible = true">토스트 띄우기</BaseButton>
        <Toast v-model="visible" :variant="args.variant" :duration="args.duration">
          저장되었습니다.
        </Toast>
      </div>
    `,
  }),
}

export const Info = {}

export const Success = {
  args: { variant: 'success' },
}

export const Error = {
  args: { variant: 'error' },
}
