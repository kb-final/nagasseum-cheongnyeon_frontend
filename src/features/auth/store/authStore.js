import { ref } from 'vue'
import { defineStore } from 'pinia'

import { loginWithKakao, updateBasicInfo } from '@/features/auth/api/authApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(null)

  async function loginWithKakaoAccount() {
    const response = await loginWithKakao()
    user.value = response.user
    accessToken.value = response.accessToken
  }

  async function submitBasicInfo(basicInfo) {
    const response = await updateBasicInfo(user.value.id, basicInfo)
    user.value = response.user
    return response
  }

  return { user, accessToken, loginWithKakaoAccount, submitBasicInfo }
})
