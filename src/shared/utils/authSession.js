const STORAGE_KEY = 'auth-session'

export function loadAuthSession() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

export class AuthSessionMissingError extends Error {
  constructor() {
    super('로그인 세션이 없습니다.')
    this.name = 'AuthSessionMissingError'
  }
}

// 로컬 개발 전용. router/index.js의 SKIP_AUTH_GUARD와 동일한 플래그를 공유해서,
// 로그인 없이 화면에 바로 접근했을 때도 memberId가 필요한 API를 그대로 확인할 수 있게 한다.
// 프로덕션 빌드에서는 반드시 꺼져 있어야 한다.
const SKIP_AUTH_GUARD = import.meta.env.VITE_SKIP_AUTH_GUARD === 'true'
const DEV_FALLBACK_MEMBER_ID = 1

// 정상 흐름에서는 라우터 가드가 이미 로그인 여부를 확인하므로 세션이 비어 있을 수 없다.
// SKIP_AUTH_GUARD가 꺼진 상태에서 세션이 없는 예외적인 경우, 원인 불명의 TypeError 대신
// 구분 가능한 에러를 던져 호출부가 "로그인 필요" 상태를 별도로 처리할 수 있게 한다.
export function getCurrentMemberId() {
  const { user } = loadAuthSession()
  if (user?.id) return user.id
  if (SKIP_AUTH_GUARD) return DEV_FALLBACK_MEMBER_ID
  throw new AuthSessionMissingError()
}

export function saveAuthSession(session) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearAuthSession() {
  sessionStorage.removeItem(STORAGE_KEY)
}
