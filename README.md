# nagasseum-cheongnyeon (frontend)

청년 독립 준비 플랫폼 프론트엔드 · **Vue 3 + Vite**

> 처음 세팅 시 → **[ONBOARDING.md](./ONBOARDING.md)** 를 순서대로 따라하시면 도움을 받을 수 있습니다.

---

## ⚠️ 필수 환경

| 항목    | 버전                                                                       | 주의                                               |
| ------- | -------------------------------------------------------------------------- | -------------------------------------------------- |
| Node.js | **20.19+ / 22.12+**                                                        | Vite 8 · ESLint 10 요구 버전                       |
| npm     | 10+                                                                        | Node.js에 기본 포함                                |
| Backend | [nagasseum-cheongnyeon](https://github.com/kb-final/nagasseum-cheongnyeon) | `localhost:8080` 실행 필요 (API 연동 화면 확인 시) |

---

## 빠른 시작

```bash
git clone https://github.com/kb-final/nagasseum-cheongnyeon_frontend.git <변경할 폴더 이름> # 변경할 폴더 이름 미지정 시 기본값
cd nagasseum-cheongnyeon_frontend
git checkout develop

npm install        # 프로젝트에 필요한 패키지(라이브러리)를 설치하는 명령어입니다.
npm run dev        # 프로젝트의 개발 서버를 실행하는 명령어입니다. 이후 http://localhost:5173로 실제 웹 화면을 확인 가능합니다.
```

> 환경 변수(`.env`)는 저장소에 커밋되어 있어 별도 설정 없이 바로 동작합니다. 자세한 내용은 [ONBOARDING.md](./ONBOARDING.md)를 참고하세요.

### 동작 확인

```bash
open http://localhost:5173
```

백엔드(`localhost:8080`)가 떠 있어야 API를 호출하는 화면이 정상 동작합니다.

---

## Git Hooks

Husky + lint-staged가 설정되어 있어, 커밋 시 스테이징된 파일에 대해 자동으로 실행됩니다.

```
*.{js,jsx,ts,tsx,vue}         → eslint --fix, prettier --write
*.{json,css,scss,md,yml,yaml,html} → prettier --write
```

`npm install` 시 `prepare` 스크립트로 자동 활성화됩니다.

---

## 패키지 구조

도메인 단위로 관련 파일(api, store, components, views)을 묶는 구조입니다.

```
src/
│
├── features/                        # 도메인별 독립 모듈
│   └── {domain}/
│       ├── api/
│       │   └── {domain}Api.js       # 해당 도메인 API 호출 함수 모음
│       │
│       ├── components/              # 해당 도메인 전용 UI 컴포넌트
│       │   ├── {Domain}Table.vue
│       │   ├── {Domain}Form.vue
│       │   └── {Domain}Card.vue
│       │
│       ├── composables/             # 해당 도메인 전용 훅
│       │   └── use{Domain}.js
│       │
│       ├── store/
│       │   └── {domain}Store.js     # Pinia 스토어 (해당 도메인 상태만 관리)
│       │
│       ├── views/                   # 라우팅 대상 페이지 컴포넌트
│       │   ├── {Domain}ListView.vue
│       │   ├── {Domain}DetailView.vue
│       │   └── {Domain}CreateView.vue
│       │
│       └── index.js                 # 외부 공개 인터페이스 (barrel export)
│
├── shared/                          # 도메인 간 공통 리소스
│   ├── api/
│   │   ├── httpClient.js            # axios 인스턴스 & 인터셉터 설정
│   │   └── errorHandler.js
│   │
│   ├── components/                  # 공용 UI 컴포넌트
│   │   ├── BaseButton.vue           # 공용 컴포넌트는 "Base"로 시작합니다.
│   │   ├── BaseTable.vue
│   │   ├── BaseModal.vue
│   │   ├── BasePagination.vue
│   │   └── BaseInput.vue
│   │
│   ├── composables/                 # 공용 훅
│   │   ├── useModal.js
│   │   ├── usePagination.js
│   │   └── useToast.js
│   │
│   ├── constants/                   # 전역 상수
│   │   └── statusCode.js
│   │
│   └── utils/                       # 순수 유틸 함수
│       ├── formatter.js             # 날짜, 금액 포맷
│       └── validator.js
│
├── layouts/                         # 전체 레이아웃
│   ├── DefaultLayout.vue            # Sidebar + Header 포함 기본 레이아웃
│   └── AuthLayout.vue               # 로그인 등 인증 페이지 레이아웃
│
├── router/
│   ├── index.js                     # Vue Router 진입점
│   └── routes/                      # 도메인별 라우트 분리
│       └── {domain}.routes.js
│
├── assets/                          # 정적 리소스
│   ├── images/
│   └── styles/
│       └── main.css
│
├── App.vue
└── main.js
```

**새 도메인을 추가할 땐 `features/{domain}` 하위에 위 구조(`api/components/composables/store/views/index.js`)를 그대로 복제해서 채우세요.**

---

## Dependency Rules

도메인 간 무분별한 직접 참조를 방지하기 위해 아래 규칙을 따릅니다.

```
features/{domain-A}  →  features/{domain-B}  직접 import 금지
features/{domain}    →  shared/              허용
shared/              →  features/{domain}    금지
```

- 각 도메인의 `index.js`를 통해서만 외부로 공개 (내부 구현 은닉)
- 도메인 간 공유 로직은 반드시 `shared/`로 추출 후 사용

---

## Naming Convention

| 분류          | 규칙                       | 예시               |
| ------------- | -------------------------- | ------------------ |
| 컴포넌트 파일 | PascalCase                 | `LoanTable.vue`    |
| 뷰 파일       | PascalCase + View 접미사   | `LoanListView.vue` |
| 스토어 파일   | camelCase + Store 접미사   | `loanStore.js`     |
| API 파일      | camelCase + Api 접미사     | `loanApi.js`       |
| 라우트 파일   | camelCase + .routes 접미사 | `loan.routes.js`   |
| composable    | use 접두사 + PascalCase    | `useLoan.js`       |

---
