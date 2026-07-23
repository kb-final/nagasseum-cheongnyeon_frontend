# MSW (Mock Service Worker)

백엔드 API가 아직 준비되지 않았거나, 특정 응답(에러, 빈 값, 특수 케이스)을 재현하며 프론트엔드만 독립적으로 개발할 때 [MSW(Mock Service Worker)](https://mswjs.io/)를 사용합니다. 실제 네트워크 요청을 가로채 정의된 목 응답으로 대체하는 방식이라, 컴포넌트/스토어/API 함수 코드는 실제 백엔드를 붙일 때와 동일하게 유지됩니다.

---

## 구조

```
src/mocks/
├── browser.js              # msw/browser의 setupWorker에 handlers를 등록하는 진입점
├── handlers/
│   ├── index.js            # 도메인별 핸들러를 모아 하나의 handlers 배열로 export
│   └── {domain}Handlers.js # 도메인별 목 API 핸들러 (loanHandlers.js 등)
└── data/                   # 핸들러가 반환할 목 데이터(fixture)

public/
└── mockServiceWorker.js    # `npx msw init public/` 로 생성된 서비스 워커 스크립트 (직접 수정 금지)
```

전체 패키지 구조 안에서 `mocks/`가 어디에 위치하는지는 [architecture.md](./architecture.md)를 참고하세요.

---

## 활성화 방법

`.env`의 `VITE_USE_MOCK` 값으로 on/off 합니다.

```
VITE_USE_MOCK=true   # MSW 활성화 (목 데이터로 응답)
VITE_USE_MOCK=false  # MSW 비활성화 (실제 백엔드 localhost:8080 호출)
```

`src/main.js`에서 앱을 마운트하기 전에 `VITE_USE_MOCK`을 확인해 워커를 시작합니다.

```js
async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK !== 'true') return

  const { worker } = await import('@/mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking().then(() => {
  createApp(App).use(createPinia()).use(router).mount('#app')
})
```

- `onUnhandledRequest: 'bypass'`: 핸들러가 등록되지 않은 요청은 경고 없이 실제 네트워크로 그대로 보냅니다. 일부 API만 목으로 대체하고 나머지는 실제 백엔드를 그대로 쓰고 싶을 때 유용합니다.
- 값이 `true`가 아니면 `worker.start()` 자체를 호출하지 않으므로, 프로덕션 빌드나 `VITE_USE_MOCK=false` 환경에서는 MSW 관련 코드가 아예 실행되지 않습니다.

---

## 새 도메인 핸들러 추가하기

1. `src/mocks/data/{domain}.js`에 목 데이터를 정의합니다.

```js
// src/mocks/data/loan.js
export const loans = [
  { id: 1, title: '전세자금대출', amount: 50000000 },
  { id: 2, title: '청년월세지원', amount: 200000 },
]
```

2. `src/mocks/handlers/{domain}Handlers.js`에 요청 URL과 응답을 정의합니다. `httpClient`의 `baseURL`(`VITE_API_BASE_URL`)을 기준으로 상대 경로를 매칭합니다.

```js
// src/mocks/handlers/loanHandlers.js
import { http, HttpResponse } from 'msw'

import { loans } from '@/mocks/data/loan'

export const loanHandlers = [
  http.get('/api/loans', () => {
    return HttpResponse.json(loans)
  }),

  http.get('/api/loans/:id', ({ params }) => {
    const loan = loans.find((item) => item.id === Number(params.id))

    if (!loan) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(loan)
  }),

  http.post('/api/loans', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: loans.length + 1, ...body }, { status: 201 })
  }),
]
```

3. `src/mocks/handlers/index.js`에 새 핸들러를 추가합니다.

```js
import { loanHandlers } from '@/mocks/handlers/loanHandlers'

export const handlers = [...loanHandlers]
```

---

## 동작 확인

1. `.env`에서 `VITE_USE_MOCK=true`로 설정합니다.
2. `npm run dev` 실행 후 브라우저 콘솔에 `[MSW] Mocking enabled.` 로그가 찍히는지 확인합니다.
3. 개발자 도구 Network 탭에서 목 API 요청에 `(from service worker)` 표시가 붙는지 확인합니다.

---

## 주의사항

- `.env`는 저장소에 커밋되므로, 로컬 테스트를 위해 `VITE_USE_MOCK=true`로 바꿨다면 **커밋 전에 `false`로 되돌려주세요.**
- `public/mockServiceWorker.js`는 `npx msw init public/ --save`로 생성된 파일입니다. MSW 버전을 올릴 경우 동일 명령으로 재생성하세요.
- 목 핸들러는 실제 API 응답 스펙과 최대한 동일하게 유지해, 나중에 `VITE_USE_MOCK=false`로 전환했을 때 화면이 깨지지 않도록 합니다.
