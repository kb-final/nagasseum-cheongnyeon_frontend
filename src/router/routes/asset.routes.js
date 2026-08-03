import { AssetLinkView, AssetAuthView, AssetSyncingView } from '@/features/asset'

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
  {
    path: 'asset-syncing',
    name: 'asset-syncing',
    component: AssetSyncingView,
  },
]
