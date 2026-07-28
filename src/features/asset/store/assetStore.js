import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { getAssetOrganizations, linkAssetConnection } from '@/features/asset/api/assetApi'

export const useAssetStore = defineStore('asset', () => {
  const organizations = ref([])
  const isLoaded = ref(false)
  const selectedInstitutions = ref([])

  async function fetchOrganizations({ force = false } = {}) {
    if (isLoaded.value && !force) return organizations.value

    const response = await getAssetOrganizations()
    organizations.value = response.data
    isLoaded.value = true
    return organizations.value
  }

  function setSelectedInstitutions(institutions) {
    selectedInstitutions.value = institutions
  }

  const currentInstitution = computed(() => selectedInstitutions.value[0] ?? null)

  async function authenticateCurrentInstitution(credentials) {
    const institution = currentInstitution.value
    await linkAssetConnection({ organizationCode: institution.id, ...credentials })
    selectedInstitutions.value = selectedInstitutions.value.slice(1)
  }

  return {
    organizations,
    isLoaded,
    selectedInstitutions,
    currentInstitution,
    fetchOrganizations,
    setSelectedInstitutions,
    authenticateCurrentInstitution,
  }
})
