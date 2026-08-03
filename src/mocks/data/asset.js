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

// Figma "07 자산 상세 화면" 목업. [추가] 계좌 목록 조회 API(GET /api/v1/assets/accounts/{memberId}) 응답 형태.
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
      loanAccounts: [],
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
      loanAccounts: [],
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
      ],
      loanAccounts: [],
    },
  ],
}
