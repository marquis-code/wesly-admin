import { ref } from 'vue'

export type TemplateType = 'customer' | 'savings'

export const useTemplateDownload = () => {
  const isDownloading = ref(false)
  const error = ref<string | null>(null)

  // In a real app, these would be actual URLs to your template files
  const templateUrls = {
    customer: '/templates/customer-template.xlsx',
    savings: '/templates/savings-template.xlsx'
  }

  const downloadTemplate = async (type: TemplateType) => {
    isDownloading.value = true
    error.value = null

    try {
      // In a real app, you might fetch this from an API
      const url = templateUrls[type]
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = `${type}-template.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to download template'
      throw err
    } finally {
      isDownloading.value = false
    }
  }

  return {
    isDownloading,
    error,
    downloadTemplate
  }
}