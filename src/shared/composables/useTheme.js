import { reactive, readonly, toRefs } from 'vue'

const THEME_STORAGE_KEY = 'theme'
const DEFAULT_THEME = 'dark'

const state = reactive({
  theme: DEFAULT_THEME,
})

/** localStorage는 프라이빗 브라우징 등에서 접근이 막힐 수 있어 try/catch로 감싼다. */
function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

function writeStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // 저장 실패해도 화면 동작에는 영향 없음
  }
}

/** 저장된 테마 → OS 선호 색상 스킴 → 프로젝트 기본값(dark) 순으로 초기 테마를 정한다. */
function resolveInitialTheme() {
  const stored = readStoredTheme()
  if (stored) return stored

  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: light)').matches
  ) {
    return 'light'
  }

  return DEFAULT_THEME
}

function applyTheme(theme) {
  state.theme = theme
  document.documentElement.dataset.theme = theme
}

/** 앱 부팅 시 1회 호출. 기존 저장값을 다시 쓰지 않고 DOM/state에만 반영한다. */
export function initTheme() {
  applyTheme(resolveInitialTheme())
}

function setTheme(theme) {
  if (theme !== 'light' && theme !== 'dark') return
  applyTheme(theme)
  writeStoredTheme(theme)
}

function toggleTheme() {
  setTheme(state.theme === 'dark' ? 'light' : 'dark')
}

export function useTheme() {
  return {
    ...toRefs(readonly(state)),
    setTheme,
    toggleTheme,
  }
}
