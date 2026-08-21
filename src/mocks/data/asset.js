import { isAfter3M } from '@/mocks/data/member'

// ─────────────────────────────────────────────────────────────────────────────
// 시연용 자산 구성 (25세 · 입사 6개월 차)
//
//   입출금   KB국민은행    급여통장             1,200,000
//   적금     신한은행      청년희망적금          2,000,000  (3개월 뒤 4,100,000)
//   주식     미래에셋증권  위탁종합계좌            800,000  (3개월 뒤   880,000)
//   청약     KB국민은행    주택청약종합저축      4,200,000
//   직접등록 –             현재 거주 보증금     25,000,000
//   ─────────────────────────────────────────────────────
//   총자산                                     33,200,000  (3개월 뒤 35,380,000)
//   대출     한국장학재단  학자금대출            5,000,000  (3개월 뒤  4,900,000)
//   순자산                                     28,200,000  (3개월 뒤 30,480,000)
//
// 주거 예산에는 청약통장이 빠지고 주식은 70%만 인정된다(백엔드 규칙).
// → 현재 가용 예산 28,760,000 / 3년 후 예산 약 5,616만원
// ─────────────────────────────────────────────────────────────────────────────

const SAVINGS_BALANCE = isAfter3M ? 4_100_000 : 2_000_000
// 인벤토리는 currentValue ?? valuationAmount 만 읽고 예수금(depositReceived)을 더하지 않는다.
// 총자산 카드와 인벤토리 합계가 어긋나지 않도록 평가금액 하나에 전액을 담는다.
const STOCK_BALANCE = isAfter3M ? 880_000 : 800_000
const LOAN_BALANCE = isAfter3M ? 4_900_000 : 5_000_000

const DEMAND_BALANCE = 1_200_000
const SUBSCRIPTION_BALANCE = 4_200_000
const MANUAL_DEPOSIT = 25_000_000

const ACCOUNTS_TOTAL = DEMAND_BALANCE + SAVINGS_BALANCE + STOCK_BALANCE + SUBSCRIPTION_BALANCE
const TOTAL_ASSETS = ACCOUNTS_TOTAL + MANUAL_DEPOSIT

export const mockOrganizationsResponse = {
  success: true,
  data: [
    // 시연에서 연동하는 3곳. 온보딩(챕터 ②)을 찍을 때는 isConnected를 모두 false로 바꾸고
    // 아래 mockConnectionsResponse.data도 빈 배열로 비워야 기관 선택 화면에 3곳이 다 보인다.
    {
      organizationCode: '0004',
      organizationName: 'KB국민은행',
      businessType: 'BK',
      supportedLoginTypes: ['ID', 'CERTIFICATE'],
      isConnected: false,
    },
    {
      organizationCode: '0088',
      organizationName: '신한은행',
      businessType: 'BK',
      supportedLoginTypes: ['ID', 'CERTIFICATE'],
      isConnected: false,
    },
    {
      organizationCode: '1001',
      organizationName: '미래에셋증권',
      businessType: 'ST',
      supportedLoginTypes: ['ID', 'CERTIFICATE'],
      isConnected: false,
    },
    // 아래는 선택지를 채우기 위한 미연동 기관들.
    {
      organizationCode: '0020',
      organizationName: '우리은행',
      businessType: 'BK',
      supportedLoginTypes: ['ID', 'CERTIFICATE'],
      isConnected: false,
    },
    {
      organizationCode: '0081',
      organizationName: '하나은행',
      businessType: 'BK',
      supportedLoginTypes: ['ID', 'CERTIFICATE'],
      isConnected: false,
    },
    {
      organizationCode: '0089',
      organizationName: 'IBK기업은행',
      businessType: 'BK',
      supportedLoginTypes: ['ID', 'CERTIFICATE'],
      isConnected: false,
    },
    // 증권/카드는 실제 금융기관 표준코드가 아닌 로컬 테스트용 임의 코드다.
    {
      organizationCode: '1002',
      organizationName: '삼성증권',
      businessType: 'ST',
      supportedLoginTypes: ['ID', 'CERTIFICATE'],
      isConnected: false,
    },
    {
      organizationCode: '1003',
      organizationName: '키움증권',
      businessType: 'ST',
      supportedLoginTypes: ['ID', 'CERTIFICATE'],
      isConnected: false,
    },
    {
      organizationCode: '2001',
      organizationName: '신한카드',
      businessType: 'CD',
      supportedLoginTypes: ['ID', 'CERTIFICATE'],
      isConnected: false,
    },
    {
      organizationCode: '2003',
      organizationName: 'KB국민카드',
      businessType: 'CD',
      supportedLoginTypes: ['ID', 'CERTIFICATE'],
      isConnected: false,
    },
  ],
  error: null,
}

export const mockConnectionsResponse = {
  success: true,
  data: [
    {
      organizationCode: '0004',
      organizationName: 'KB국민은행',
      businessType: 'BK',
      connectedAt: '2026-08-18T10:00:00',
    },
    {
      organizationCode: '0088',
      organizationName: '신한은행',
      businessType: 'BK',
      connectedAt: '2026-08-18T10:02:00',
    },
    {
      organizationCode: '1001',
      organizationName: '미래에셋증권',
      businessType: 'ST',
      connectedAt: '2026-08-18T10:04:00',
    },
  ],
  error: null,
}

export function createMockConnectionResponse(organizationCode) {
  const organization = mockOrganizationsResponse.data.find(
    (item) => item.organizationCode === organizationCode,
  )

  if (organization) organization.isConnected = true

  const action = mockConnectionsResponse.data.length === 0 ? 'CREATED' : 'ADDED'

  if (!mockConnectionsResponse.data.some((item) => item.organizationCode === organizationCode)) {
    mockConnectionsResponse.data.push({
      organizationCode,
      organizationName: organization?.organizationName ?? '',
      businessType: organization?.businessType ?? '',
      connectedAt: new Date().toISOString(),
    })
  }

  return {
    success: true,
    data: {
      connectedId: 'byi1wYwD40k8hEIiXl6bRF',
      organization: organizationCode,
      action,
    },
    error: null,
  }
}

export function deleteMockConnection(organizationCode) {
  const index = mockConnectionsResponse.data.findIndex(
    (item) => item.organizationCode === organizationCode,
  )

  if (index === -1) {
    return {
      success: false,
      error: {
        code: 'ASSET_ORGANIZATION_NOT_CONNECTED',
        message: '연동되지 않은 기관입니다.',
        fields: null,
      },
    }
  }

  const [removed] = mockConnectionsResponse.data.splice(index, 1)

  const organization = mockOrganizationsResponse.data.find(
    (item) => item.organizationCode === organizationCode,
  )
  if (organization) organization.isConnected = false

  return {
    success: true,
    data: {
      organizationCode: removed.organizationCode,
      organizationName: removed.organizationName,
    },
    error: null,
  }
}

// 자산 동기화 비동기 폴링 흐름 재현용.
// 상태 조회를 SYNC_JOB_PENDING_CHECKS번 PENDING으로 응답한 뒤 SUCCESS로 전환한다.
const SYNC_JOB_PENDING_CHECKS = 2
const mockSyncJobs = new Map()

export function createMockSyncJob() {
  const jobId = crypto.randomUUID()
  mockSyncJobs.set(jobId, { checkCount: 0 })
  return jobId
}

export function getMockSyncJobStatus(jobId) {
  const job = mockSyncJobs.get(jobId)
  if (!job) return null

  job.checkCount += 1

  if (job.checkCount <= SYNC_JOB_PENDING_CHECKS) {
    return { jobId, status: 'PENDING', errorMessage: null, resultUrl: null }
  }

  mockSyncJobs.delete(jobId)
  return {
    jobId,
    status: 'SUCCESS',
    errorMessage: null,
    resultUrl: '/api/v1/assets/summary',
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

// GET /api/v1/assets/summary — 홈 '내 자산' 카드와 자산 인벤토리 상단 '보유 골드'가 쓴다.
// totalAssets = 계좌 합계 + 수동 자산(현재 거주 보증금)이어야 인벤토리 합계와 어긋나지 않는다.
export const mockAssetSummaryResponse = {
  memberId: 1,
  totalAssets: TOTAL_ASSETS,
  loanBalance: LOAN_BALANCE,
  netAssets: TOTAL_ASSETS - LOAN_BALANCE,
  monthlySavings: 700000,
  syncedAt: isAfter3M ? '2026-11-20T09:12:00+09:00' : '2026-08-20T09:12:00+09:00',
  assetBreakdown: {
    cashAssets: {
      total: DEMAND_BALANCE + SAVINGS_BALANCE + SUBSCRIPTION_BALANCE,
      accounts: [
        {
          institutionName: 'KB국민은행',
          accountType: 'DEMAND',
          productName: '급여통장',
          accountDisplay: '****-**-1204',
          balance: DEMAND_BALANCE,
        },
        {
          institutionName: '신한은행',
          accountType: 'SAVINGS',
          productName: '청년희망적금',
          accountDisplay: '****-**-8765',
          balance: SAVINGS_BALANCE,
        },
        {
          institutionName: 'KB국민은행',
          accountType: 'SUBSCRIPTION',
          productName: '주택청약종합저축',
          accountDisplay: '****-**-3344',
          balance: SUBSCRIPTION_BALANCE,
        },
      ],
    },
    investmentAssets: {
      total: STOCK_BALANCE,
      accounts: [
        {
          institutionName: '미래에셋증권',
          accountType: 'STOCK',
          productName: '위탁종합계좌',
          accountDisplay: '****-**-9900',
          balance: STOCK_BALANCE,
        },
      ],
    },
  },
  loans: [
    {
      institutionName: '한국장학재단',
      loanName: '학자금대출',
      accountDisplay: '****-**-0512',
      loanBalance: LOAN_BALANCE,
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

// 수동 자산 — 온보딩에서 직접 입력받는 '현재 거주 보증금'.
// 핸들러가 실제로 값을 더하고 빼며 조작하므로 let으로 선언한다.
export let mockManualAssetsResponse = [
  {
    id: 1,
    assetType: 'DEPOSIT',
    amount: MANUAL_DEPOSIT,
    createdAt: '2026-08-18T10:06:00+09:00',
    updatedAt: '2026-08-18T10:06:00+09:00',
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

// GET /api/v1/assets/accounts — 자산 인벤토리 '보유 아이템' 그리드와 '디버프 · 대출' 배너가 쓴다.
// 인벤토리 그룹 순서는 입출금·현금성 → 예금·적금 → 주식·펀드 → 청약통장 → 기타 자산.
//
// 학자금대출은 CODEF 은행 계좌 조회로 잡히는 항목이 아니라, 대출 계좌만 가진 별도 기관으로 둔다.
// (실제 서비스에서는 은행 응답에서 파생되지만 시연 데이터에서는 이 형태가 화면상 가장 자연스럽다)
export const mockAssetAccountsResponse = {
  institutions: [
    {
      institutionName: 'KB국민은행',
      assetAccounts: [
        {
          accountType: 'DEMAND',
          assetCategory: '현금성자산',
          accountDisplay: '****-**-1204',
          productName: '급여통장',
          currentValue: DEMAND_BALANCE,
          valuationAmount: null,
          depositReceived: null,
          valuationPl: null,
          purchaseAmount: null,
          earningsRate: null,
          startDate: '2026-02-16',
          maturityDate: null,
        },
        {
          accountType: 'SUBSCRIPTION',
          assetCategory: '청약',
          accountDisplay: '****-**-3344',
          productName: '주택청약종합저축',
          currentValue: SUBSCRIPTION_BALANCE,
          valuationAmount: null,
          depositReceived: null,
          valuationPl: null,
          purchaseAmount: null,
          earningsRate: null,
          startDate: '2019-03-04',
          maturityDate: null,
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
          currentValue: SAVINGS_BALANCE,
          valuationAmount: null,
          depositReceived: null,
          valuationPl: null,
          purchaseAmount: null,
          earningsRate: null,
          startDate: '2026-02-20',
          maturityDate: '2029-02-20',
        },
      ],
      loanAccounts: [],
    },
    {
      institutionName: '미래에셋증권',
      assetAccounts: [
        {
          accountType: 'STOCK',
          assetCategory: '투자자산',
          accountDisplay: '****-**-9900',
          productName: '위탁종합계좌',
          currentValue: null,
          valuationAmount: STOCK_BALANCE,
          depositReceived: null,
          valuationPl: STOCK_BALANCE - 750_000,
          purchaseAmount: 750_000,
          earningsRate: Number((((STOCK_BALANCE - 750_000) / 750_000) * 100).toFixed(2)),
          startDate: '2026-04-06',
          maturityDate: null,
        },
      ],
      loanAccounts: [],
    },
    {
      institutionName: '한국장학재단',
      assetAccounts: [],
      loanAccounts: [
        {
          loanName: '학자금대출',
          accountDisplay: '****-**-0512',
          loanBalance: LOAN_BALANCE,
          startDate: '2022-03-02',
          // 10년 상환. 만기가 짧으면 DSR 여력이 줄어 대출 한도가 모자라진다.
          endDate: '2036-08-31',
        },
      ],
    },
  ],
}
