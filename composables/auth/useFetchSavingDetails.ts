
import { ref } from 'vue'
import { auth_api } from '@/apiFactory/modules/auth'
import type { AxiosError } from 'axios'

export interface AccountData {
  id: number
  accountStatus: string
  address: string
  branch: string | null
  bvn: string
  customerId: string
  customerStatus: string
  dob: string
  email: string
  firstName: string
  gender: 'MALE' | 'FEMALE'
  lastName: string
  middleName: string
  nin: string | null
  phoneNumber: string
  productType: string | null
  reason: string | null
  userId: string | null
  status: string
  username: string | null
  createdAt: string | null
  updatedAt: string | null
}

interface PageableInfo {
  sort: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  offset: number
  pageSize: number
  pageNumber: number
  paged: boolean
  unpaged: boolean
}

interface SavingDetailsResponse {
  content: AccountData[]
  pageable: PageableInfo
  totalElements: number
  last: boolean
  totalPages: number
  first: boolean
  size: number
  number: number
  sort: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  numberOfElements: number
  empty: boolean
}

export const useFetchSavingDetails = () => {
  const loading = ref(false)
  const savingDetails = ref<SavingDetailsResponse | null>(null)
  const error = ref<string | null>(null)

  const fetchSavingDetails = async (
    savingType: 'customer' | 'savings',
    metadata: { page: number; size: number }
  ) => {
    loading.value = true
    error.value = null
    try {
      const res = await auth_api.$_get_saving_details(savingType, metadata)
      savingDetails.value = res.data.data
    } catch (e: unknown) {
      const err = e as AxiosError
      error.value = 'Failed to fetch saving details'
      console.error('Error fetching saving details:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    savingDetails,
    error,
    fetchSavingDetails,
  }
}
