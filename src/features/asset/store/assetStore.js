import { ref } from 'vue'
import { defineStore } from 'pinia'

import { getAssetOrganizations } from '@/features/asset/api/assetApi'

export const useAssetStore = defineStore('asset', () => {
  const organizations = ref([])
  const isLoaded = ref(false)

  async function fetchOrganizations({ force = false } = {}) {
    if (isLoaded.value && !force) return organizations.value

    const response = await getAssetOrganizations()
    organizations.value = response.data
    isLoaded.value = true
    return organizations.value
  }

  return { organizations, isLoaded, fetchOrganizations }
})
