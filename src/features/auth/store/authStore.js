import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { loginWithKakao, updateBasicInfo } from '@/features/auth/api/authApi'

const SESSION_STORAGE_KEY = 'auth-session'

function loadSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

export const useAuthStore = defineStore('auth', () => {
  const session = loadSession()
  const user = ref(session.user ?? null)
  const accessToken = ref(session.accessToken ?? null)

  watch(
    [user, accessToken],
    ([nextUser, nextAccessToken]) => {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ user: nextUser, accessToken: nextAccessToken }),
      )
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
