import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { loadAuthSession, saveAuthSession } from '@/shared/utils/authSession'

import { loginWithKakao, updateBasicInfo } from '@/features/auth/api/authApi'

export const useAuthStore = defineStore('auth', () => {
  const session = loadAuthSession()
  const user = ref(session.user ?? null)
  const accessToken = ref(session.accessToken ?? null)

  watch(
    [user, accessToken],
    ([nextUser, nextAccessToken]) => {
      saveAuthSession({ user: nextUser, accessToken: nextAccessToken })
    },
    { deep: true },
  )

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
