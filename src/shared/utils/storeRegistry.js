const registeredStores = new Map()

// Pinia 플러그인: 스토어가 생성될 때마다 등록해 둔다. main.js에서 pinia.use(trackStore)로 연결한다.
export function trackStore({ store }) {
  registeredStores.set(store.$id, store)
}

// 로그아웃 시 auth를 제외한 모든 스토어를 폐기(dispose)해, 다음 useXStore() 호출에서
// 초기 상태로 새로 생성되게 한다. setup 문법 스토어는 $reset()을 지원하지 않아 이 방식을 쓴다.
export function resetOtherStores(keepStoreId) {
  registeredStores.forEach((store, id) => {
    if (id === keepStoreId) return
    store.$dispose()
    registeredStores.delete(id)
  })
}
