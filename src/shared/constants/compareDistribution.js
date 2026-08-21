// 또래 비교 API(소득 구간 분포) enum 값을 화면 표시용 한글로 변환하는 매핑.
// 백엔드 IncomeBracket(member.income_bracket 컬럼) enum을 그대로 따른다 — 마이페이지 소득 분위
// 등록(INCOME_BRACKET_OPTIONS)과 같은 6단계 그룹 값이라, 같은 라벨을 쓴다.

import { INCOME_BRACKET_OPTIONS } from '@/shared/constants/incomeBracket'

const DECILE_LABEL = Object.fromEntries(
  INCOME_BRACKET_OPTIONS.map((option) => [option.value, option.label]),
)

// 서버가 소득 분위를 안 넣은 사람들을 한 덩어리로 묶어 보내준다
export const INCOME_BRACKET_LABEL = {
  ...DECILE_LABEL,
  UNKNOWN: '미입력',
}

// 분위 라벨(1분위, 2~3분위 ...)이 이미 짧아 막대 그래프 x축에도 그대로 쓸 수 있다.
export const INCOME_BRACKET_SHORT_LABEL = INCOME_BRACKET_LABEL

// "나와 같은 OOO 구간에 있어요" 같은 한 줄 요약 문장에 쓰는 라벨
export const INCOME_BRACKET_BAND_LABEL = INCOME_BRACKET_LABEL

// 산맥 형태 차트의 x축 순서를 API 응답 순서와 무관하게 저분위 → 고분위로 고정한다.
// 미입력은 분위 순서가 없으므로 항상 맨 오른쪽에 둔다.
export const INCOME_BRACKET_ORDER = [
  ...INCOME_BRACKET_OPTIONS.map((option) => option.value),
  'UNKNOWN',
]
