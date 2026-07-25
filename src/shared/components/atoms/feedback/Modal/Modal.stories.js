import { ref } from 'vue'

import BaseButton from '../../base/button/BaseButton.vue'
import Modal from './Modal.vue'

export default {
  title: 'Atoms/Feedback/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    title: '알림',
  },
  render: (args) => ({
    components: { Modal, BaseButton },
    setup() {
      const isOpen = ref(true)
      return { args, isOpen }
    },
    template: `
      <div>
        <BaseButton @click="isOpen = true">모달 열기</BaseButton>
        <Modal v-model="isOpen" :title="args.title">
          <p>모달 본문 내용입니다.</p>
          <template #footer>
            <BaseButton variant="secondary" size="modal" @click="isOpen = false">취소</BaseButton>
            <BaseButton variant="primary" size="modal" @click="isOpen = false">확인</BaseButton>
          </template>
        </Modal>
      </div>
    `,
  }),
}

export const Open = {}

export const WithoutTitle = {
  args: { title: '' },
}
