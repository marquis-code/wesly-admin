import { ref, onMounted } from 'vue'
import { document_api } from '@/apiFactory/modules/account'

export interface SavingDocument {
  id: string
  filename: string
  uploadDate: string
  size: number
  type: string
  url: string
}

export const useSavingDocuments = () => {
  const documents = ref<SavingDocument[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchSavingDocuments = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await document_api.$_fetch_saving_document()
      // Assuming the API returns an array of documents
      documents.value = response.data || []
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch documents'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    fetchSavingDocuments()
  })

  return {
    documents,
    isLoading,
    error,
    fetchSavingDocuments
  }
}