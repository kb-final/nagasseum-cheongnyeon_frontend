/**
 * 직업군 선택지.
 *
 * <p>value는 백엔드 OccupationType enum과 같은 이름이어야 한다. 하나라도 다르면
 * 서버에서 역직렬화가 실패한다. 라벨은 enum 주석에 적힌 이름을 그대로 옮겼다.
 *
 * <p>순서는 enum 선언 순서를 따른다. 코호트 필터와 직업군 분포 카드도 같은 값을 쓴다.
 */
export const OCCUPATION_OPTIONS = [
  { value: 'STUDENT', label: '학생' },
  { value: 'JOB_SEEKER', label: '취업 준비' },
  { value: 'OFFICE_WORKER', label: '회사원' },
  { value: 'PUBLIC_SERVANT', label: '공무원·공공기관' },
  { value: 'PROFESSIONAL', label: '전문직' },
  { value: 'SELF_EMPLOYED', label: '자영업' },
  { value: 'FREELANCER', label: '프리랜서' },
  { value: 'SOLDIER', label: '군인' },
  { value: 'OTHER', label: '기타' },
]

/**
 * 직업군 분포 카드용 라벨 표.
 *
 * <p>서버가 직업군을 안 넣은 사람들을 UNKNOWN 한 덩어리로 묶어 보내준다. 값이 없으면
 * 화면에 'UNKNOWN'이 그대로 찍히기 때문에 여기 같이 넣어둔다.
 */
export const OCCUPATION_LABEL = {
  ...Object.fromEntries(OCCUPATION_OPTIONS.map(({ value, label }) => [value, label])),
  UNKNOWN: '미입력',
}
