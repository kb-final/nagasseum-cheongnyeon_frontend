# Storybook

`shared/components`의 공용 UI 컴포넌트를 화면(라우트)과 독립적으로 렌더링하고, 상태별(props/slot 조합) 모습을 눈으로 확인하며 개발할 때 [Storybook](https://storybook.js.org/)을 사용합니다. 각 스토리는 [Vitest](https://vitest.dev/) 브라우저 테스트로도 그대로 실행되어, 컴포넌트가 에러 없이 렌더링되는지 자동으로 검증합니다.

---

## 구조

```
.storybook/
├── main.js       # 프레임워크(@storybook/vue3-vite), addon, 스토리 파일 탐색 경로 설정
└── preview.js    # 모든 스토리에 공통 적용되는 전역 설정(controls, a11y 등)

src/shared/components/
├── BaseButton.vue
├── BaseButton.stories.js   # 컴포넌트 파일과 같은 폴더에 co-location
├── BaseInput.vue
├── BaseInput.stories.js
└── ...
```

- 스토리 파일은 대상 컴포넌트와 **같은 폴더**에 둡니다. `features/{domain}/components`에 도메인 전용 컴포넌트가 생기면 그 폴더 안에도 동일한 방식으로 `{Component}.stories.js`를 추가할 수 있습니다.
- `.storybook/main.js`의 `stories` 옵션이 `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`를 전부 훑기 때문에 위치와 무관하게 자동으로 인식됩니다.

전체 패키지 구조 안에서 컴포넌트/스토리 파일 위치는 [architecture.md](./architecture.md)를 참고하세요.

---

## 실행 방법

```bash
npm run storybook         # http://localhost:6006 에서 Storybook 실행
```

---

## 스토리 작성 규칙

CSF3(Component Story Format 3) 문법을 사용합니다. `BaseButton.stories.js`를 예시로 설명합니다.

```js
// src/shared/components/BaseButton.stories.js
import { fn } from 'storybook/test'

import BaseButton from './BaseButton.vue'

export default {
  title: 'Shared/BaseButton', // Shared/{ComponentName} 형식
  component: BaseButton,
  tags: ['autodocs'],
  args: {
    variant: 'primary',
    onClick: fn(),
  },
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args }
    },
    template: `<BaseButton :variant="args.variant" @click="args.onClick">{{ args.label }}</BaseButton>`,
  }),
}

export const Primary = {
  args: { variant: 'primary', label: '확인' },
}
```

- `title`: `Shared/{ComponentName}` 형식으로 통일합니다. (`shared/components`가 아닌 도메인 컴포넌트라면 `{Domain}/{ComponentName}`)
- `tags: ['autodocs']`: Storybook의 자동 문서 생성 페이지를 켭니다.
- `v-model`이나 이벤트로 상태가 바뀌는 컴포넌트(`BaseInput`, `BaseModal`, `BasePagination`)는 `render` 함수 안에서 로컬 `ref`로 상태를 들고 있어야 스토리 안에서 실제로 상호작용(타이핑, 모달 열고 닫기, 페이지 이동)이 동작합니다. 각 컴포넌트의 `.stories.js`를 참고하세요.

---

## Vitest 연동 (addon-vitest)

`@storybook/addon-vitest`가 모든 스토리를 Vitest 브라우저 테스트로 자동 변환해 실행합니다. 별도의 `vitest.config.js`를 두지 않고, 루트 `vite.config.js`의 `test.projects`에 `storybook` 프로젝트로 병합되어 있습니다.

```js
// vite.config.js
test: {
  projects: [
    {
      extends: true, // vite.config.js의 plugins/resolve.alias를 그대로 상속
      plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{ browser: 'chromium' }],
        },
      },
    },
  ],
},
```

```bash
npm run test   # vitest --project=storybook, 모든 스토리를 headless 브라우저에서 실행
```

- **최초 1회, 로컬에 Chromium 브라우저 바이너리를 설치해야 합니다.**

  ```bash
  npx playwright install chromium
  ```

  설치돼 있지 않으면 `npm run test` 실행 시 브라우저를 찾지 못해 실패합니다. `node_modules`처럼 로컬 환경에만 존재하고 git에는 커밋되지 않으므로, 새로 클론한 사람은 한 번 실행해줘야 합니다.

- 스토리를 새로 추가하면 별도 테스트 코드 없이도 `npm run test`가 해당 스토리를 렌더링해 에러 여부를 검증합니다. 상호작용 테스트가 필요하면 스토리에 [`play` 함수](https://storybook.js.org/docs/writing-stories/play-function)를 추가하세요.

---

## 접근성(a11y) 검사

`@storybook/addon-a11y`가 설치되어 있고, `.storybook/preview.js`에서 기본값은 `test: 'todo'`입니다.

```js
a11y: {
  // 'todo'  - 위반 사항을 Storybook의 Accessibility 탭에서만 보여줌 (현재 값)
  // 'error' - a11y 위반 시 테스트(및 CI) 실패 처리
  // 'off'   - a11y 검사 자체를 건너뜀
  test: 'todo',
},
```

컴포넌트의 접근성을 CI에서 강제하고 싶다면 이 값을 `'error'`로 바꾸면 됩니다.

---

## Chromatic 배포

[Chromatic](https://www.chromatic.com/)은 PR에 커밋을 푸시할 때마다 Storybook을 자동으로 빌드·배포해 공유 가능한 URL을 만들어주고, 이전 상태와 비교해 컴포넌트가 시각적으로 의도치 않게 바뀌었는지 diff로 보여주는 서비스입니다. `main`/`develop`에 머지되면 그 상태가 새 비교 기준(baseline)으로 갱신됩니다.

### 최초 1회 설정 (수동, 저장소 관리자)

Chromatic 프로젝트 토큰은 계정 연동이 필요해 코드만으로는 만들 수 없습니다. 아래를 한 번 진행해야 합니다.

1. [chromatic.com](https://www.chromatic.com/)에 GitHub 계정으로 로그인하고, 이 저장소(`nagasseum-cheongnyeon_frontend`)를 프로젝트로 추가합니다.
2. 생성된 **project token**을 복사합니다.
3. GitHub 저장소 **Settings → Secrets and variables → Actions**에서 `CHROMATIC_PROJECT_TOKEN`이라는 이름으로 토큰을 등록합니다.

이 secret이 등록되기 전까지는 `.github/workflows/chromatic.yml`의 배포 스텝이 실패합니다.

### CI 동작 방식

```yaml
# .github/workflows/chromatic.yml (발췌)
on: push

jobs:
  chromatic:
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Chromatic이 이전 커밋과 비교하려면 전체 git 히스토리가 필요합니다.
      - run: npm ci
      - uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

- `on: push`이기 때문에 PR 브랜치에 커밋을 푸시할 때마다(머지 전에도) 배포되고, PR에 프리뷰 URL과 시각적 diff가 자동으로 코멘트/체크로 달립니다.
- `main`/`develop`으로 머지된 뒤 다시 실행되면 그 브랜치 상태가 새 baseline이 됩니다.

### 로컬에서 수동 실행

```bash
CHROMATIC_PROJECT_TOKEN=<프로젝트 토큰> npm run chromatic
```

CI 없이 로컬에서 직접 배포/비교하고 싶을 때 사용합니다. `--exit-zero-on-changes` 옵션이 기본으로 걸려 있어(`package.json`의 `chromatic` 스크립트), 시각적 변경이 있어도 로컬 실행은 실패로 처리되지 않습니다.

---

## 주의사항

- `storybook-static/`은 `.gitignore`에 포함되어 있어 커밋 대상이 아닙니다. 배포가 필요하면 `npm run build-storybook`으로 매번 새로 빌드하세요.
- 스토리 파일은 실제 컴포넌트 코드가 아니라 사용 예시입니다. props/슬롯 스펙이 바뀌면 스토리도 함께 갱신해서 실제 컴포넌트와 어긋나지 않도록 합니다.
