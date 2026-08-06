export function formatDate(date, locale = 'ko-KR') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date))
}

export function formatCurrency(amount, locale = 'ko-KR', currency = 'KRW') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

export function formatManwon(amount, locale = 'ko-KR') {
  return `${Math.round(amount / 10000).toLocaleString(locale)}만원`
}

// "32,480,000" 형태로 표기할 때 사용 (단위 없이 천 단위 구분 기호만)
export function formatNumber(amount, locale = 'ko-KR') {
  return new Intl.NumberFormat(locale).format(amount)
}

// "32,480,000원" 형태로 표기할 때 사용 (통화 기호 없이 숫자 + 원 단위)
export function formatWon(amount, locale = 'ko-KR') {
  return `${formatNumber(amount, locale)}원`
}

// "2028-09-30" -> "2028년 9월" (일자는 의미가 없고 연월만 보여주는 목표 시점/달성 시점 표기용)
export function formatYearMonthKo(date) {
  const d = new Date(date)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`
}

// "2028-09-30" -> "2028.09" (계좌 만기일 등 짧은 연월 표기용)
export function formatYearMonthDot(date) {
  const d = new Date(date)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`
}

// "9.3억" 형태로 축약 표기 (억 단위 미만은 소수 첫째 자리까지, 불필요한 0은 생략)
export function formatEok(amount) {
  const eok = Number((amount / 100000000).toFixed(1))
  return `${eok}억`
}

// "2027-08" -> "2027년 8월". null/undefined면 계산 불가 문구로 대체 (홈 화면 예상 달성 시점처럼 null이 올 수 있는 필드용)
export function formatYearMonth(yearMonth, fallback = '예상 시점 계산 불가') {
  if (!yearMonth) return fallback
  const [year, month] = yearMonth.split('-')
  return `${year}년 ${Number(month)}월`
}

// 10, 20 -> "10~20평"
export function formatAreaRange(areaMin, areaMax) {
  return `${areaMin}~${areaMax}평`
}

// 시세 변동액에 부호를 붙여 "▲ 500만 원" / "▼ 500만 원" / "500만 원"(변동 없음)으로 표기
export function formatChangeAmount(amount) {
  const arrow = amount > 0 ? '▲ ' : amount < 0 ? '▼ ' : ''
  return `${arrow}${formatManwon(Math.abs(amount))}`
}
