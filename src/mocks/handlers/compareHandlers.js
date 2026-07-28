import { http, HttpResponse } from 'msw'

import { mockCompareInsufficient, mockCompareSuccess } from '@/mocks/data/compare'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const BASE_COHORT = mockCompareSuccess.data.cohort
const MINIMUM_REQUIRED = mockCompareInsufficient.data.cohort.minimumRequired

/**
 * 범위를 넓히면 대상이 늘어나는 걸 화면에서 확인할 수 있도록 대충 비례시킨다.
 * 실제 집계 로직과는 무관한 목 전용 값이다.
 */
function fakeCohortSize(assetRange, ageRange) {
  const assetFactor = assetRange / BASE_COHORT.assetRange
  const ageFactor = ageRange / BASE_COHORT.ageRange
  return Math.round(BASE_COHORT.cohortSize * assetFactor * ageFactor)
}

export const compareHandlers = [
  http.get(`${API_BASE_URL}/api/v1/goals/comparison`, ({ request }) => {
    const params = new URL(request.url).searchParams

    // 실제 서버도 집계에 사용한 기준을 그대로 돌려준다. 목도 같은 모양을 유지한다.
    const assetRange = Number(params.get('assetRange')) || BASE_COHORT.assetRange
    const ageRange = Number(params.get('ageRange')) || BASE_COHORT.ageRange
    const cohortSize = fakeCohortSize(assetRange, ageRange)

    // k-익명성 미달이면 통계를 내리지 않는다.
    if (cohortSize < MINIMUM_REQUIRED) {
      return HttpResponse.json({
        ...mockCompareInsufficient,
        data: {
          ...mockCompareInsufficient.data,
          cohort: {
            ...mockCompareInsufficient.data.cohort,
            assetRange,
            ageRange,
            cohortSize,
          },
        },
      })
    }

    return HttpResponse.json({
      ...mockCompareSuccess,
      data: {
        ...mockCompareSuccess.data,
        cohort: {
          ...BASE_COHORT,
          assetRange,
          ageRange,
          cohortSize,
        },
      },
    })
  }),
]
