import Table from './Table.vue'

export default {
  title: 'Atoms/Data Display/Table',
  component: Table,
  tags: ['autodocs'],
}

const columns = [
  { key: 'name', label: '이름' },
  { key: 'amount', label: '금액' },
]

const rows = [
  { id: 1, name: '전세자금대출', amount: '50,000,000원' },
  { id: 2, name: '청년월세지원', amount: '200,000원' },
]

export const Default = {
  args: { columns, rows },
}

export const Empty = {
  args: { columns, rows: [] },
}
