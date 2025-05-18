import { ref } from "vue"
import { dashboard_api } from "@/apiFactory/modules/dashboard"

export const useFetchProfile = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const profileObj = ref<Branch | null>(null)

  const fetchProfile = async (branchId: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await dashboard_api.$_get_profile()
      console.log(response, 'oprieje')
      profileObj.value = response.data || null
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message
      throw err
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchProfile()
  })

  return {
    loading,
    error,
    profileObj,
    fetchProfile,
  }
}
