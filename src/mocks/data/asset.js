export const mockOrganizationsResponse = {
  success: true,
  data: [
    {
      organizationCode: '0004',
      organizationName: 'KB국민은행',
      businessType: 'BK',
      supportedLoginTypes: ['ID', 'CERTIFICATE'],
    },
    {
      organizationCode: '0088',
      organizationName: '신한은행',
      businessType: 'BK',
      supportedLoginTypes: ['ID', 'CERTIFICATE'],
    },
    {
      organizationCode: '0020',
      organizationName: '우리은행',
      businessType: 'BK',
      supportedLoginTypes: ['ID', 'CERTIFICATE'],
    },
    {
      organizationCode: '0081',
      organizationName: '하나은행',
      businessType: 'BK',
      supportedLoginTypes: ['ID', 'CERTIFICATE'],
    },
    {
      organizationCode: '0089',
      organizationName: 'IBK기업은행',
      businessType: 'BK',
      supportedLoginTypes: ['ID', 'CERTIFICATE'],
    },
  ],
  error: null,
}

export function createMockConnectionResponse(organizationCode) {
  const organization = mockOrganizationsResponse.data.find(
    (item) => item.organizationCode === organizationCode,
  )

  return {
    success: true,
    data: {
      connectedId: 'byi1wYwD40k8hEIiXl6bRF',
      organizationCode,
      organizationName: organization?.organizationName ?? '',
    },
    error: null,
  }
}

export function createMockManualAssetResponse({ assetType, amount }) {
  const now = new Date().toISOString()
  return {
    success: true,
    data: { id: 1, assetType, amount, createdAt: now, updatedAt: now },
    error: null,
  }
}

export const mockConnectionFailureResponse = {
  success: false,
  error: {
    code: 'ASSET_CODEF_AUTH_FAILED',
    message: '기관 인증에 실패했습니다.',
    fields: null,
  },
}

// 노션 "연동 기관 목록 조회"(GET /api/v1/assets/connections) 응답 형태.
export const mockAssetConnectionsResponse = {
  success: true,
  data: [
    {
      organizationCode: '0004',
      organizationName: 'KB국민은행',
      businessType: 'BK',
      connectedAt: '2026-06-15T10:00:00+09:00',
    },
    {
      organizationCode: '0088',
      organizationName: '신한은행',
      businessType: 'BK',
      connectedAt: '2026-07-02T09:30:00+09:00',
    },
  ],
  error: null,
}

export function createMockConnectionDeleteResponse(organizationCode) {
  const organization = mockAssetConnectionsResponse.data.find(
    (item) => item.organizationCode === organizationCode,
  )

  return {
    success: true,
    data: {
      organizationCode,
      organizationName: organization?.organizationName ?? '',
    },
    error: null,
  }
}

export const mockConnectionNotFoundResponse = {
  success: false,
  error: {
    code: 'ASSET_ORGANIZATION_NOT_CONNECTED',
    message: '연동되지 않은 기관입니다.',
    fields: null,
  },
}

// 노션 "자산 요약 조회"(GET /api/v1/assets/summary/{memberId}) 응답 형태.
// mockAssetAccountsResponse의 계좌 합산액과 일치하도록 값을 맞춰 뒀다 (총자산 36,530,000 = 현금성 7,600,000
// + 예적금 21,700,000 + 청약 1,080,000 + 투자자산 5,300,000 + 기타 850,000).
export const mockAssetSummaryResponse = {
  memberId: 1,
  totalAssets: 36530000,
  loanBalance: 112000000,
  netAssets: -75470000,
  monthlySavings: 450000,
  syncedAt: '2026-08-02T21:40:00+09:00',
  assetBreakdown: {
    cashAssets: {
      total: 29300000,
      accounts: [
        {
          institutionName: '토스뱅크',
          accountType: 'DEPOSIT',
          productName: '파킹통장',
          accountDisplay: '****-**-1234',
          balance: 6400000,
        },
        {
          institutionName: '카카오뱅크',
          accountType: 'DEPOSIT',
          productName: '입출금통장',
          accountDisplay: '****-**-5678',
          balance: 1200000,
        },
        {
          institutionName: '카카오뱅크',
          accountType: 'SAVINGS',
          productName: '자유적금',
          accountDisplay: '****-**-4321',
          balance: 8200000,
        },
        {
          institutionName: '신한은행',
          accountType: 'SAVINGS',
          productName: '청년희망적금',
          accountDisplay: '****-**-8765',
          balance: 9500000,
        },
        {
          institutionName: 'KB국민은행',
          accountType: 'SAVINGS',
          productName: '정기예금',
          accountDisplay: '****-**-1122',
          balance: 4000000,
        },
      ],
    },
    investmentAssets: {
      total: 5300000,
      accounts: [
        {
          institutionName: '토스증권',
          accountType: 'STOCK',
          productName: 'CMA',
          accountDisplay: '****-**-9900',
          balance: 2100000,
        },
        {
          institutionName: '토스증권',
          accountType: 'FUND',
          productName: '글로벌리츠펀드',
          accountDisplay: '****-**-9911',
          balance: 3200000,
        },
      ],
    },
  },
  loans: [
    {
      institutionName: '신한은행',
      loanName: '신한 마이카대출',
      accountDisplay: '****-**-7799',
      loanBalance: 12000000,
    },
    {
      institutionName: 'KB국민은행',
      loanName: 'KB주택담보대출',
      accountDisplay: '****-**-5566',
      loanBalance: 100000000,
    },
  ],
}

export const mockAssetSummaryNotFoundResponse = {
  success: false,
  data: null,
  error: {
    code: 'ASSET_SUMMARY_NOT_FOUND',
    message: '자산 연동 정보가 없습니다. 먼저 금융기관을 연동해주세요.',
  },
}

// 노션 "[추가] 수동 자산" CRUD(POST/GET/PUT/DELETE /api/v1/assets/manual)가 다루는 목록.
// assetType "DEPOSIT"은 계좌 목록 조회의 accountType과 이름은 같지만 의미가 다르다 (예: 현재 거주 보증금).
// 핸들러가 실제로 값을 더하고 빼며 조작하므로 let으로 선언한다.
export let mockManualAssetsResponse = [
  {
    id: 1,
    assetType: 'DEPOSIT',
    amount: 50000000,
    createdAt: '2026-06-01T10:00:00+09:00',
    updatedAt: '2026-06-01T10:00:00+09:00',
  },
]

export function setMockManualAssets(nextAssets) {
  mockManualAssetsResponse = nextAssets
}

export const mockManualAssetNotFoundResponse = {
  success: false,
  data: null,
  error: {
    code: 'ASSET_MANUAL_NOT_FOUND',
    message: '수동 자산을 찾을 수 없습니다.',
  },
}

// Figma "07 자산 상세 화면" 목업. [추가] 계좌 목록 조회 API(GET /api/v1/assets/accounts/{memberId}) 응답 형태.
// 노션 "[추가] 계좌 목록 조회" 명세에 등장하는 accountType(DEPOSIT/SAVINGS/STOCK/FUND/SUBSCRIPTION)과
// assetCategory(현금성자산/예적금/투자자산/청약/기타)를 모두 최소 1개씩, 대출 계좌도 포함해 커버한다.
export const mockAssetAccountsResponse = {
  institutions: [
    {
      institutionName: '토스뱅크',
      assetAccounts: [
        {
          accountType: 'DEPOSIT',
          assetCategory: '현금성자산',
          accountDisplay: '****-**-1234',
          productName: '파킹통장',
          currentValue: 6400000,
          valuationAmount: null,
          depositReceived: null,
          valuationPl: null,
          purchaseAmount: null,
          earningsRate: null,
          startDate: '2024-02-10',
          maturityDate: null,
        },
      ],
      loanAccounts: [],
    },
    {
      institutionName: '카카오뱅크',
      assetAccounts: [
        {
          accountType: 'DEPOSIT',
          assetCategory: '현금성자산',
          accountDisplay: '****-**-5678',
          productName: '입출금통장',
          currentValue: 1200000,
          valuationAmount: null,
          depositReceived: null,
          valuationPl: null,
          purchaseAmount: null,
          earningsRate: null,
          startDate: '2023-11-02',
          maturityDate: null,
        },
        {
          accountType: 'SAVINGS',
          assetCategory: '예적금',
          accountDisplay: '****-**-4321',
          productName: '자유적금',
          currentValue: 8200000,
          valuationAmount: null,
          depositReceived: null,
          valuationPl: null,
          purchaseAmount: null,
          earningsRate: null,
          startDate: '2025-03-01',
          maturityDate: '2027-03-01',
        },
      ],
      loanAccounts: [],
    },
    {
      institutionName: '신한은행',
      assetAccounts: [
        {
          accountType: 'SAVINGS',
          assetCategory: '예적금',
          accountDisplay: '****-**-8765',
          productName: '청년희망적금',
          currentValue: 9500000,
          valuationAmount: null,
          depositReceived: null,
          valuationPl: null,
          purchaseAmount: null,
          earningsRate: null,
          startDate: '2024-12-01',
          maturityDate: '2026-12-01',
        },
      ],
      loanAccounts: [
        {
          loanName: '신한 마이카대출',
          accountDisplay: '****-**-7799',
          loanBalance: 12000000,
          startDate: '2025-01-10',
          endDate: '2030-01-10',
        },
      ],
    },
    {
      institutionName: 'KB국민은행',
      assetAccounts: [
        {
          accountType: 'SAVINGS',
          assetCategory: '예적금',
          accountDisplay: '****-**-1122',
          productName: '정기예금',
          currentValue: 4000000,
          valuationAmount: null,
          depositReceived: null,
          valuationPl: null,
          purchaseAmount: null,
          earningsRate: null,
          startDate: '2023-06-01',
          maturityDate: '2027-06-01',
        },
        {
          accountType: 'SUBSCRIPTION',
          assetCategory: '청약',
          accountDisplay: '****-**-3344',
          productName: '주택청약종합저축',
          currentValue: 1080000,
          valuationAmount: null,
          depositReceived: null,
          valuationPl: null,
          purchaseAmount: null,
          earningsRate: null,
          startDate: '2021-01-15',
          maturityDate: null,
        },
      ],
      loanAccounts: [
        {
          loanName: 'KB주택담보대출',
          accountDisplay: '****-**-5566',
          loanBalance: 100000000,
          startDate: '2022-03-01',
          endDate: '2032-03-01',
        },
      ],
    },
    {
      institutionName: '토스증권',
      assetAccounts: [
        {
          accountType: 'STOCK',
          assetCategory: '투자자산',
          accountDisplay: '****-**-9900',
          productName: 'CMA',
          currentValue: null,
          valuationAmount: 2100000,
          depositReceived: 2000000,
          valuationPl: 100000,
          purchaseAmount: 2000000,
          earningsRate: 5.0,
          startDate: '2024-05-20',
          maturityDate: null,
        },
        {
          accountType: 'FUND',
          assetCategory: '투자자산',
          accountDisplay: '****-**-9911',
          productName: '글로벌리츠펀드',
          currentValue: null,
          valuationAmount: 3200000,
          depositReceived: 3500000,
          valuationPl: -300000,
          purchaseAmount: 3500000,
          earningsRate: -8.57,
          startDate: '2024-09-12',
          maturityDate: null,
        },
      ],
      loanAccounts: [],
    },
    {
      institutionName: '미래에셋증권',
      assetAccounts: [
        {
          // CODEF가 아직 표준 accountType으로 분류하지 못한 상품 예시.
          // assetStore의 ACCOUNT_TYPE_LABELS에 없는 값이라 assetCategory 라벨로 대체 표기되는지 확인하는 용도.
          accountType: 'FOREIGN_CURRENCY',
          assetCategory: '기타',
          accountDisplay: '****-**-2233',
          productName: '외화 RP',
          currentValue: 850000,
          valuationAmount: null,
          depositReceived: null,
          valuationPl: null,
          purchaseAmount: null,
          earningsRate: null,
          startDate: '2025-02-20',
          maturityDate: null,
        },
      ],
      loanAccounts: [],
    },
  ],
}
