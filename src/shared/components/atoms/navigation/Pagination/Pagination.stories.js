import { ref, watch } from 'vue'
import { fn } from 'storybook/test'

import Pagination from './Pagination.vue'

export default {
  title: 'Atoms/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    page: 1,
    totalPages: 10,
    'onUpdate:page': fn(),
  },
  render: (args) => ({
    components: { Pagination },
    setup() {
      const page = ref(args.page)

      watch(
        () => args.page,
        (nextPage) => {
          page.value = nextPage
        },
      )

      function handleUpdate(nextPage) {
        page.value = nextPage
        args['onUpdate:page'](nextPage)
      }

      return { args, page, handleUpdate }
    },
    template: `<Pagination :page="page" :total-pages="args.totalPages" @update:page="handleUpdate" />`,
  }),
}

export const Default = {}

export const FirstPage = {
  args: { page: 1, totalPages: 5 },
}

export const LastPage = {
  args: { page: 5, totalPages: 5 },
}

export const SinglePage = {
  args: { page: 1, totalPages: 1 },
}
