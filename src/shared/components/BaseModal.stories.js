import { ref } from 'vue'

import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'

export default {
  title: 'Shared/BaseModal',
  component: BaseModal,
  tags: ['autodocs'],
  args: {
    title: '알림',
  },
  render: (args) => ({
    components: { BaseModal, BaseButton },
    setup() {
      const isOpen = ref(true)
      return { args, isOpen }
    },
    template: `
      <div>
        <BaseButton @click="isOpen = true">모달 열기</BaseButton>
        <BaseModal v-model="isOpen" :title="args.title">
          <p>모달 본문 내용입니다.</p>
          <template #footer>
            <BaseButton variant="secondary" @click="isOpen = false">닫기</BaseButton>
          </template>
        </BaseModal>
      </div>
    `,
  }),
}

export const Open = {}

export const WithoutTitle = {
  args: { title: '' },
}
