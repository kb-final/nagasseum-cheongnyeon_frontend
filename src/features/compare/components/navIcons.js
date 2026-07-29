import { h } from 'vue'

function icon(paths) {
  return {
    render: () =>
      h(
        'svg',
        { viewBox: '0 0 18 18', fill: 'none' },
        paths.map((attrs) => h('path', attrs)),
      ),
  }
}

export const HomeIcon = icon([
  {
    d: 'M3 8L9 3L15 8V15H3V8Z',
    stroke: 'currentColor',
    'stroke-width': '1.5',
    'stroke-linejoin': 'round',
  },
])

export const CompareIcon = {
  render: () =>
    h('svg', { viewBox: '0 0 18 18', fill: 'none' }, [
      h('circle', { cx: '9', cy: '9', r: '6.2', stroke: 'currentColor', 'stroke-width': '1.5' }),
      h('circle', { cx: '9', cy: '9', r: '1.8', fill: 'currentColor' }),
    ]),
}

export const HistoryIcon = icon([
  {
    d: 'M3 4H15V14H3V4Z',
    stroke: 'currentColor',
    'stroke-width': '1.5',
    'stroke-linejoin': 'round',
  },
  {
    d: 'M6 8H12M6 11H10',
    stroke: 'currentColor',
    'stroke-width': '1.5',
    'stroke-linecap': 'round',
  },
])

export const MyIcon = {
  render: () =>
    h('svg', { viewBox: '0 0 18 18', fill: 'none' }, [
      h('circle', { cx: '9', cy: '6.5', r: '3', stroke: 'currentColor', 'stroke-width': '1.5' }),
      h('path', {
        d: 'M3.5 15C3.5 11.5 6 10 9 10C12 10 14.5 11.5 14.5 15',
        stroke: 'currentColor',
        'stroke-width': '1.5',
        'stroke-linecap': 'round',
      }),
    ]),
}
