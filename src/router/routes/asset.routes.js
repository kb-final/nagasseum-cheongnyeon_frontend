import { AssetLinkView, AssetAuthView } from '@/features/asset'

export const assetRoutes = [
  {
    path: 'asset-link',
    name: 'asset-link',
    component: AssetLinkView,
  },
  {
    path: 'asset-auth',
    name: 'asset-auth',
    component: AssetAuthView,
  },
]
