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
