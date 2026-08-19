import { computed, reactive } from 'vue'

import climberBlue from '@/assets/images/climber.png'
import climberGreen from '@/assets/images/climber1.png'
import climberStraw from '@/assets/images/climber3.png'
import climberPink from '@/assets/images/climber4.png'

/*
  프로필 캐릭터 선택.

  서버에 저장할 자리가 없어서(members 테이블에도 MemberProfileResponse에도 프로필 이미지
  필드가 없다) 테마 설정(useTheme.js)과 같은 방식으로 localStorage에 둔다. 따라서 브라우저
  단위로만 유지되고, 기기를 바꾸거나 사이트 데이터를 지우면 기본값으로 돌아간다.
  백엔드에 필드가 생기면 read/write 두 함수만 API 호출로 바꾸면 된다.

  파일명(climber2)이 비어 있어 id는 파일명을 그대로 쓴다 — 나중에 저장된 값을 보고
  어떤 그림인지 바로 알 수 있게 하기 위함이다.
*/
const STORAGE_KEY = 'avatar'

/*
  crop — 전신 그림에서 모자 위~가슴 구간만 원 안에 보이게 하는 값(컨테이너 대비 비율).
  세 값은 원 지름과 무관한 비율이라 76px·84px·64px 어디에 써도 그대로 통한다.

  캐릭터마다 값이 다른 이유: 같은 1086x1448 캔버스라도 그려진 크기와 위치가 제각각이다.
  (예: 밀짚모자는 캔버스를 더 꽉 채우고, 포니테일은 머리가 오른쪽으로 뻗어 중심이 어긋난다)
  하나로 통일하면 어떤 캐릭터는 얼굴만 크게 잡히고 어떤 캐릭터는 작게 잡힌다.

  조절 규칙:
    width 크게 → 캐릭터 커짐 | top 크게 → 아래로 | left 크게(0에 가깝게) → 오른쪽으로
*/
export const AVATAR_OPTIONS = [
  {
    id: 'climber',
    label: '파란 후드',
    src: climberBlue,
    crop: { width: '123.4%', left: '-12.4%', top: '4.5%' },
  },
  {
    id: 'climber1',
    label: '초록 재킷',
    src: climberGreen,
    crop: { width: '123%', left: '-13.5%', top: '5%' },
  },
  {
    id: 'climber3',
    label: '밀짚모자',
    src: climberStraw,
    crop: { width: '110%', left: '-6%', top: '9.5%' },
  },
  {
    id: 'climber4',
    label: '분홍 후드',
    src: climberPink,
    crop: { width: '108%', left: '-8%', top: '11.5%' },
  },
]

const DEFAULT_AVATAR_ID = AVATAR_OPTIONS[0].id

function isKnownId(id) {
  return AVATAR_OPTIONS.some((option) => option.id === id)
}

/** localStorage는 프라이빗 브라우징 등에서 접근이 막힐 수 있어 try/catch로 감싼다. */
function readStoredAvatarId() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isKnownId(stored) ? stored : null
  } catch {
    return null
  }
}

function writeStoredAvatarId(id) {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // 저장에 실패해도 이번 세션 동안은 화면에 반영된다
  }
}

/*
  모듈 스코프에 한 번만 두는 상태. 여러 화면(마이페이지·회원정보 수정·홈 등반 카드)이
  같은 객체를 보므로, 한 곳에서 바꾸면 나머지가 즉시 따라온다.
*/
const state = reactive({
  avatarId: readStoredAvatarId() ?? DEFAULT_AVATAR_ID,
})

export function useAvatar() {
  const avatarId = computed(() => state.avatarId)

  // 저장된 id가 목록에서 사라진 경우(그림 교체 등)에도 화면이 비지 않도록 기본값으로 떨어뜨린다.
  const currentOption = computed(
    () => AVATAR_OPTIONS.find((option) => option.id === state.avatarId) ?? AVATAR_OPTIONS[0],
  )

  const avatarSrc = computed(() => currentOption.value.src)

  /** 원 안에 상반신만 보이도록 잡는 위치·크기. img에 :style로 그대로 바인딩한다. */
  const avatarCrop = computed(() => currentOption.value.crop)

  function setAvatar(id) {
    if (!isKnownId(id)) return
    state.avatarId = id
    writeStoredAvatarId(id)
  }

  return { avatarId, avatarSrc, avatarCrop, setAvatar }
}
