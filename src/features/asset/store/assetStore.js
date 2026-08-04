import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { getCurrentMemberId } from '@/shared/utils/authSession'
import { formatYearMonthDot } from '@/shared/utils/formatter'

import {
  createManualAsset,
  deleteManualAsset,
  getAssetAccounts,
  getAssetOrganizations,
  getAssetSummary,
  getManualAssets,
  linkAssetConnection,
  syncAssets,
  updateManualAsset,
} from '@/features/asset/api/assetApi'

const ACCOUNT_TYPE_LABELS = {
  DEPOSIT: '자유입출금',
  SAVINGS: '적금',
  STOCK: '주식',
  FUND: '펀드',
}

const ASSET_CATEGORY_LABELS = {
  현금성자산: '입출금·현금성 자산',
  예적금: '예금·적금',
  투자자산: '주식·펀드',
  청약: '청약통장',
  기타: '기타 자산',
}

const ASSET_CATEGORY_ORDER = ['현금성자산', '예적금', '투자자산', '청약', '기타']

const MANUAL_ASSET_TYPE_LABELS = {
  DEPOSIT: '현재 거주 보증금',
}

function buildAssetAccountViewModel(account, institutionName) {
  const typeLabel =
    ACCOUNT_TYPE_LABELS[account.accountType] ??
    ASSET_CATEGORY_LABELS[account.assetCategory] ??
    account.assetCategory
  const subLabel = account.maturityDate
    ? `${typeLabel} · 만기 ${formatYearMonthDot(account.maturityDate)}`
    : typeLabel

  return {
    id: `${institutionName}-${account.accountDisplay}`,
    name: `${institutionName} ${account.productName}`,
    subLabel,
    amount: account.currentValue ?? account.valuationAmount ?? 0,
  }
}

function buildLoanAccountViewModel(loan, institutionName) {
  return {
    id: `${institutionName}-${loan.accountDisplay}`,
    name: `${institutionName} ${loan.loanName}`,
    subLabel: loan.accountDisplay,
    amount: loan.loanBalance,
  }
}

function buildManualAssetViewModel(asset) {
  return {
    id: `manual-${asset.id}`,
    name: MANUAL_ASSET_TYPE_LABELS[asset.assetType] ?? asset.assetType,
    subLabel: '직접 등록',
    amount: asset.amount,
  }
}

// 계좌 목록 조회(GET /api/v1/assets/accounts/{memberId}) 응답을
// 화면에서 쓰는 { categories, loans } 형태로 변환
// 총자산은 자산 요약 조회(GET /api/v1/assets/summary/{memberId}) 값을 그대로 사용
function transformAssetAccountsResponse(institutions) {
  const categoryMap = new Map()
  const loans = []

  for (const institution of institutions) {
    for (const account of institution.assetAccounts) {
      const viewModel = buildAssetAccountViewModel(account, institution.institutionName)

      const categoryKey = account.assetCategory
      if (!categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, {
          type: categoryKey,
          label: ASSET_CATEGORY_LABELS[categoryKey] ?? categoryKey,
          totalAmount: 0,
          accounts: [],
        })
      }
      const category = categoryMap.get(categoryKey)
      category.totalAmount += viewModel.amount
      category.accounts.push(viewModel)
    }

    for (const loan of institution.loanAccounts) {
      loans.push(buildLoanAccountViewModel(loan, institution.institutionName))
    }
  }

  const categories = [...categoryMap.values()].sort((a, b) => {
    const orderA = ASSET_CATEGORY_ORDER.indexOf(a.type)
    const orderB = ASSET_CATEGORY_ORDER.indexOf(b.type)
    if (orderA === -1 && orderB === -1) return 0
    if (orderA === -1) return 1
    if (orderB === -1) return -1
    return orderA - orderB
  })

  return { categories, loans }
}

export const useAssetStore = defineStore('asset', () => {
  const organizations = ref([])
  const isLoaded = ref(false)
  const selectedInstitutions = ref([])

  const assetDetail = ref(null)
  const isLoadingDetail = ref(false)
  const isSyncing = ref(false)
  const detailError = ref(null)

  async function fetchOrganizations({ force = false } = {}) {
    if (isLoaded.value && !force) return organizations.value

    const response = await getAssetOrganizations()
    organizations.value = response.data
    isLoaded.value = true
    return organizations.value
  }

  function setSelectedInstitutions(institutions) {
    selectedInstitutions.value = institutions
  }

  const currentInstitution = computed(() => selectedInstitutions.value[0] ?? null)

  async function authenticateCurrentInstitution(credentials) {
    const institution = currentInstitution.value
    await linkAssetConnection({ organizationCode: institution.id, ...credentials })
    selectedInstitutions.value = selectedInstitutions.value.slice(1)
  }

  async function fetchAssetDetail() {
    isLoadingDetail.value = true
    detailError.value = null

    try {
      const memberId = getCurrentMemberId()
      const [accountsResponse, summaryResponse, manualAssetsResponse] = await Promise.all([
        getAssetAccounts(memberId),
        getAssetSummary(memberId),
        getManualAssets(memberId),
      ])

      assetDetail.value = {
        ...transformAssetAccountsResponse(accountsResponse.data.institutions),
        totalAssets: summaryResponse.data.totalAssets,
        syncedAt: summaryResponse.data.syncedAt,
        manualAssets: manualAssetsResponse.data.map(buildManualAssetViewModel),
      }
    } catch (e) {
      detailError.value = e
      assetDetail.value = null
    } finally {
      isLoadingDetail.value = false
    }
  }

  async function syncAndRefreshAssetDetail() {
    isSyncing.value = true
    try {
      await syncAssets()
      await fetchAssetDetail()
    } finally {
      isSyncing.value = false
    }
  }

  async function addManualAsset(payload) {
    await createManualAsset(getCurrentMemberId(), payload)
    await fetchAssetDetail()
  }

  async function editManualAsset(id, payload) {
    await updateManualAsset(id, getCurrentMemberId(), payload)
    await fetchAssetDetail()
  }

  async function removeManualAsset(id) {
    await deleteManualAsset(id, getCurrentMemberId())
    await fetchAssetDetail()
  }

  return {
    organizations,
    isLoaded,
    selectedInstitutions,
    currentInstitution,
    fetchOrganizations,
    setSelectedInstitutions,
    authenticateCurrentInstitution,
    assetDetail,
    isLoadingDetail,
    isSyncing,
    detailError,
    fetchAssetDetail,
    syncAndRefreshAssetDetail,
    addManualAsset,
    editManualAsset,
    removeManualAsset,
  }
})
