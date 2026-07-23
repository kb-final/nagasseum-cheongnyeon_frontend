import { ref } from 'vue'
import { defineStore } from 'pinia'

import { loginWithKakao } from '@/features/auth/api/authApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(null)

  async function loginWithKakaoAccount() {
    const response = await loginWithKakao()
    user.value = response.user
    accessToken.value = response.accessToken
  }

  return { user, accessToken, loginWithKakaoAccount }
})
