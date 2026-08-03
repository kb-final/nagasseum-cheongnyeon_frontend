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

// Figma "07 자산 상세 화면" 목업. categories의 totalAmount 합이 totalAssets와 일치해야 한다.
export const mockAssetDetailResponse = {
  totalAssets: 32480000,
  syncedAt: '2026-07-28T09:12:00+09:00',
  categories: [
    {
      type: 'CASH',
      label: '입출금·현금성 자산',
      totalAmount: 7600000,
      accounts: [
        {
          id: 1,
          name: '토스뱅크 파킹통장',
          subLabel: '자유입출금',
          amount: 6400000,
          highlight: true,
        },
        {
          id: 2,
          name: '카카오뱅크 입출금통장',
          subLabel: '자유입출금',
          amount: 1200000,
          highlight: false,
        },
      ],
    },
    {
      type: 'DEPOSIT_SAVINGS',
      label: '예금·적금',
      totalAmount: 21700000,
      accounts: [
        {
          id: 3,
          name: '카카오뱅크 자유적금',
          subLabel: '적금 · 만기 2027.03',
          amount: 8200000,
          highlight: false,
        },
        {
          id: 4,
          name: '신한은행 청년희망적금',
          subLabel: '적금 · 만기 2026.12',
          amount: 9500000,
          highlight: false,
        },
        {
          id: 5,
          name: 'KB국민 정기예금',
          subLabel: '예금 · 만기 2027.06',
          amount: 4000000,
          highlight: false,
        },
      ],
    },
    {
      type: 'STOCK_FUND',
      label: '주식·펀드',
      totalAmount: 2100000,
      accounts: [
        { id: 6, name: '토스증권 CMA', subLabel: 'ETF·국내주식', amount: 2100000, highlight: true },
      ],
    },
    {
      type: 'SUBSCRIPTION',
      label: '청약통장',
      totalAmount: 1080000,
      accounts: [
        {
          id: 7,
          name: '주택청약종합저축',
          subLabel: '가입 62회차',
          amount: 1080000,
          highlight: false,
        },
      ],
    },
    {
      type: 'ETC',
      label: '기타 자산',
      totalAmount: 0,
      accounts: [],
    },
  ],
  loans: [],
}
