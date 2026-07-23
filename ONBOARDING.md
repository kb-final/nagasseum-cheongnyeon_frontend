# ONBOARDING

첫 프로젝트 시작을 위한 문서입니다.

막히는 부분이 있으면 언제든지 질문해 주세요!

---

## 시작 전 준비물

| 항목    | 버전/종류                                                                  | 비고                                                                |
| ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Node.js | **20.19+** 또는 **22.12+**                                                 | Vite 8 / ESLint 10이 요구하는 최소 버전. `nvm` 사용을 권장합니다.   |
| npm     | 10 이상                                                                    | Node.js 설치 시 함께 설치됩니다.                                    |
| Git     | 최신                                                                       | -                                                                   |
| 에디터  | VS Code (권장)                                                             | 다른 에디터도 가능하지만 이 문서는 VS Code 기준으로 설명합니다.     |
| Backend | [nagasseum-cheongnyeon](https://github.com/kb-final/nagasseum-cheongnyeon) | 실제 데이터가 필요한 화면을 확인하려면 필요 (없어도 UI 개발은 가능) |

---

## STEP 1. Node.js 버전 확인

이 프로젝트는 Node **20.19 이상** 또는 **22.12 이상**에서만 정상 동작합니다. (Vite 8, ESLint 10의 최소 요구 버전)

```bash
node -v
```

버전이 안 맞거나 Node가 여러 프로젝트마다 다르게 필요하다면 `nvm`으로 버전을 관리하세요.

```bash
nvm install 22
nvm use 22
```

---

## STEP 2. 저장소 클론

```bash
git clone https://github.com/kb-final/nagasseum-cheongnyeon_frontend.git
cd nagasseum-cheongnyeon_frontend
```

---

## STEP 3. 패키지 설치

```bash
npm install
```

설치가 잘 됐는지 확인:

```bash
git config core.hooksPath   # .husky/_ 가 출력되면 정상
```

---

## STEP 4. 환경 변수 설정

이 프로젝트의 `.env` 파일은 **저장소에 커밋되어 있습니다.** 클론하면 바로 아래 내용이 들어있는
`.env`가 생기고, 별도로 파일을 만들거나 복사할 필요가 없습니다.

```
VITE_API_BASE_URL=http://localhost:8080
```

- `src/shared/api/httpClient.js`가 이 값을 axios 인스턴스의 `baseURL`로 사용합니다.
- 백엔드를 `localhost:8080`이 아닌 다른 포트로 띄웠다면, 이 파일의 값을 로컬에서만 바꿔서 쓰세요.
- 단, `.env`는 커밋 대상이므로 **바꾼 값을 그대로 커밋하지 않도록 주의**해주세요.

---

## STEP 5. 개발 서버 실행

```bash
npm run dev
```

터미널에 뜨는 주소(기본값 `http://localhost:5173`)로 접속해서 화면이 뜨는지 확인합니다.

- 5173 포트가 이미 사용 중이면: `npm run dev -- --port 5174` 처럼 다른 포트를 지정하세요.
- 코드를 수정하면 HMR(Hot Module Replacement)로 바로 반영됩니다.

---

## STEP 6. 에디터 세팅 (VS Code)

프로젝트를 열면 우측 하단에 확장 프로그램 설치 추천 팝업이 뜹니다. 아래 세 개를 설치하세요.

- **Vue.volar** — Vue 3 `<script setup>` 문법 지원 및 타입 체크
- **dbaeumer.vscode-eslint** — ESLint 연동
- **esbenp.prettier-vscode** — Prettier 연동

설치하지 않아도 `git commit` 시 `lint-staged`가 자동으로 검사/포맷하긴 하지만,
저장할 때마다 바로 확인하려면 위 확장이 필요합니다.
저장 시 자동 포맷 + ESLint 자동 수정은 `.vscode/settings.json`에 이미 설정되어 있어서
확장만 설치하면 바로 동작합니다.

`@/`로 시작하는 import(`@/shared/...`)가 에디터에서 빨간 줄로 표시된다면:

1. VS Code를 재시작해보세요. (`jsconfig.json`의 `@/*` 경로 매핑을 다시 읽습니다)
2. Volar 확장이 켜져 있는지 확인하세요.

---

## STEP 7. (선택) 백엔드와 연동 확인

1. [nagasseum-cheongnyeon](https://github.com/kb-final/nagasseum-cheongnyeon) 저장소의 README를 따라 백엔드를 `localhost:8080`에 띄웁니다. (`.env`가 이미 이 주소를 가리키고 있어 별도 설정이 필요 없습니다)
2. API를 호출하는 화면에서 데이터가 정상적으로 표시되는지 확인합니다.
3. 브라우저 콘솔에 CORS 에러가 뜨면, 백엔드 쪽 CORS 허용 origin에 `http://localhost:5173`이 포함되어 있는지 확인하세요.

---

## 커밋하기 전에 알아둘 것

`git commit` 시 아래가 스테이징된 파일에 대해 **자동으로** 실행됩니다. (`.husky/pre-commit` → `lint-staged`)

```
*.{js,jsx,ts,tsx,vue}               → eslint --fix, prettier --write
*.{json,css,scss,md,yml,yaml,html}  → prettier --write
```

- ESLint 에러(자동 수정 불가능한 규칙 위반)가 있으면 **커밋이 막힙니다.** 에러 메시지를 보고 코드를 고친 뒤 다시 커밋하세요.
- 자동 수정이 가능한 부분(포맷팅 등)은 알아서 고쳐지고 그 결과가 커밋에 포함됩니다.
- 급하게 훅을 건너뛰어야 하는 상황이 아니면 `--no-verify`는 사용하지 마세요.

---

## 프로젝트 구조 살펴보기

전체 구조와 네이밍 규칙, 의존성 규칙은 [README.md](./README.md)의 "패키지 구조" / "Dependency Rules" / "Naming Convention" 절을 참고하세요.

요약하면:

- 도메인 로직은 `src/features/{domain}/` 안에 모읍니다. (아직 등록된 도메인이 없다면 아래 "첫 도메인 만들기"를 참고)
- 여러 도메인이 같이 쓰는 것만 `src/shared/`로 뺍니다.
- `shared/`는 `features/`를 절대 참조하지 않고, `features/{A}`는 `features/{B}`를 직접 참조하지 않습니다.

### 첫 도메인 만들기

`src/features/`가 비어 있다면, 아래 구조를 그대로 복제해서 도메인 폴더를 채우세요. (예: `loan` 도메인)

```
src/features/loan/
├── api/
│   └── loanApi.js
├── components/
│   ├── LoanTable.vue
│   ├── LoanForm.vue
│   └── LoanCard.vue
├── composables/
│   └── useLoan.js
├── store/
│   └── loanStore.js
├── views/
│   ├── LoanListView.vue
│   ├── LoanDetailView.vue
│   └── LoanCreateView.vue
└── index.js
```

- `index.js`에서 외부에 공개할 것만 named export 하세요. 다른 코드는 반드시 `index.js`를 거쳐서 import합니다.
- 라우트는 `src/router/routes/loan.routes.js`로 분리하고, `src/router/index.js`의 `children`에 등록하세요.
- API 호출은 `src/shared/api/httpClient.js`의 axios 인스턴스를 사용하세요. (새 axios 인스턴스를 만들지 마세요)

---

## 자주 발생하는 문제 (Troubleshooting)

**`npm install` 후 `node_modules/.bin/vite`가 없다거나 설치 자체가 실패한다**
→ Node 버전을 확인하세요 (`node -v`). 20.19 미만이면 `nvm use 22`로 바꾸고 다시 설치하세요.

**`npx eslint .`를 실행하면 "couldn't find an eslint.config" 에러가 난다**
→ 프로젝트 루트(`eslint.config.js`가 있는 폴더)에서 실행하고 있는지 확인하세요. 하위 폴더에서 실행하면 안 됩니다.

**커밋해도 pre-commit 훅이 실행되지 않는다**
→ `git config core.hooksPath`가 `.husky/_`를 가리키는지 확인하세요. 값이 없다면 `npm install`을 다시 실행해서
`prepare` 스크립트가 `husky`를 재설정하도록 하세요.

**API 요청이 다 실패한다 (Network Error)**
→ 백엔드 서버가 켜져 있는지, `.env`의 `VITE_API_BASE_URL`이 백엔드 주소와 일치하는지 확인하세요.

**포트 5173이 이미 사용 중이라고 뜬다**
→ `npm run dev -- --port <다른 포트>`로 실행하거나, 5173을 점유 중인 프로세스를 종료하세요.

**`@/shared/...` 같은 import에 에디터에서 빨간 줄이 뜬다 (빌드는 되는데 에디터만 에러)**
→ 루트의 `jsconfig.json`이 삭제되지 않았는지 확인하고, VS Code를 재시작하세요.

---

## 체크리스트

- [ ] `node -v`가 20.19+ / 22.12+ 인가?
- [ ] `npm install` 완료, `git config core.hooksPath`에 `.husky/_` 출력됨
- [ ] `.env`가 클론 직후 존재하는지 확인 (`VITE_API_BASE_URL=http://localhost:8080`)
- [ ] `npm run dev`로 `localhost:5173` 접속 확인
- [ ] VS Code 추천 확장 3종 설치 (Volar, ESLint, Prettier)

여기까지 되면 개발 시작 준비 완료입니다.
