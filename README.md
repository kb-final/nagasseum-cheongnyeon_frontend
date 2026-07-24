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

> Storybook(`npm run storybook`)으로 공용 컴포넌트를 확인하거나 `npm run test`를 실행하려면, 최초 1회 `npx playwright install chromium`을 실행해야 합니다. 자세한 내용은 [docs/storybook.md](./docs/storybook.md)를 참고하세요.

---

## Git Hooks

Husky + lint-staged가 설정되어 있어, 커밋 시 스테이징된 파일에 대해 자동으로 실행됩니다.

```
*.{js,jsx,ts,tsx,vue}         → eslint --fix, prettier --write
*.{json,css,scss,md,yml,yaml,html} → prettier --write
```

`npm install` 시 `prepare` 스크립트로 자동 활성화됩니다.

---

## 추가 문서

| 문서                                                     | 내용                                          |
| -------------------------------------------------------- | --------------------------------------------- |
| [docs/architecture.md](./docs/architecture.md)           | 패키지 구조, Dependency Rules                 |
| [docs/coding-convention.md](./docs/coding-convention.md) | 파일/컴포넌트 네이밍 컨벤션                   |
| [docs/msw.md](./docs/msw.md)                             | MSW(Mock Service Worker) 설정 및 사용법       |
| [docs/storybook.md](./docs/storybook.md)                 | Storybook 설정, 스토리 작성 규칙, Vitest 연동 |

---
