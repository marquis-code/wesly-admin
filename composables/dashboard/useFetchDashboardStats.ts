import { ref } from "vue"
import { dashboard_api } from "@/apiFactory/modules/dashboard"

export const useFetchDashboardStats = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const statsObj = ref<Branch | null>(null)

  const fetchDashboardStats = async (branchId: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await dashboard_api.$_get_dashboard_stats()
      console.log(response, 'response here')
      statsObj.value = response?.data?.data || null
      return response?.data?.data
    } catch (err: any) {
      error.value = err.response?.data?.message
      throw err
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchDashboardStats()
  })

  return {
    loading,
    error,
    statsObj,
    fetchDashboardStats,
  }
}
