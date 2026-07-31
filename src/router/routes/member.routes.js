import { MyPageView, EditInfoView } from '@/features/member'

export const memberRoutes = [
  { path: 'my', name: 'my', component: MyPageView },
  { path: 'my/edit', name: 'edit-info', component: EditInfoView },
]
