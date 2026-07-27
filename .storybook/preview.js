import '../src/assets/styles/main.css'

import { INITIAL_VIEWPORTS } from 'storybook/viewport'

/** @type { import('@storybook/vue3-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },

    viewport: {
      options: INITIAL_VIEWPORTS,
    },
  },

  initialGlobals: {
    viewport: { value: 'iphone12' },
  },
}

export default preview
