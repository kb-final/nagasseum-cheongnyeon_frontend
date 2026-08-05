import { ref } from 'vue'

// 이미 로드된 데이터가 있으면 스켈레톤을 생략하고, 실패 시 에러 메시지를 세팅하는 로딩 패턴 공통화.
export function useAsyncLoad() {
  const isLoading = ref(false)
  const errorMessage = ref('')

  async function run(task, { skipSkeleton = false, errorMessage: failureMessage = '' } = {}) {
    errorMessage.value = ''
    isLoading.value = !skipSkeleton

    try {
      await task()
    } catch {
      errorMessage.value = failureMessage
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, errorMessage, run }
}
