// 또래 비교 API(소득 구간 분포) enum 값을 화면 표시용 한글로 변환하는 매핑

export const INCOME_BRACKET_LABEL = {
  UNDER_1M: '100만원 미만',
  M1_TO_2M: '100~200만원',
  M2_TO_3M: '200~300만원',
  M3_TO_4M: '300~400만원',
  M4_TO_5M: '400~500만원',
  OVER_5M: '500만원 이상',
  // 서버가 월 소득을 안 넣은 사람들을 한 덩어리로 묶어 보내준다
  UNKNOWN: '미입력',
}

// 막대 그래프 x축처럼 폭이 좁은 곳에 쓰는 축약 라벨(단위 만원 생략, "단위: 만원"을 별도 표기)
export const INCOME_BRACKET_SHORT_LABEL = {
  UNDER_1M: '~100',
  M1_TO_2M: '100~200',
  M2_TO_3M: '200~300',
  M3_TO_4M: '300~400',
  M4_TO_5M: '400~500',
  OVER_5M: '500~',
  UNKNOWN: '미입력',
}

// "나와 같은 OOO 구간" 같은 한 줄 요약 문장에 쓰는 구어체 라벨
export const INCOME_BRACKET_BAND_LABEL = {
  UNDER_1M: '100만원 미만',
  M1_TO_2M: '100만원대',
  M2_TO_3M: '200만원대',
  M3_TO_4M: '300만원대',
  M4_TO_5M: '400만원대',
  OVER_5M: '500만원 이상',
  UNKNOWN: '미입력',
}

// 산맥 형태 차트의 x축 순서를 API 응답 순서와 무관하게 저소득 → 고소득으로 고정한다.
// 미입력은 소득 순서가 없으므로 항상 맨 오른쪽에 둔다.
export const INCOME_BRACKET_ORDER = [
  'UNDER_1M',
  'M1_TO_2M',
  'M2_TO_3M',
  'M3_TO_4M',
  'M4_TO_5M',
  'OVER_5M',
  'UNKNOWN',
]
