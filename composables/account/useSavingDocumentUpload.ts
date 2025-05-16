// import { ref } from 'vue'
// import { document_api } from '@/apiFactory/modules/account'

// export const useSavingDocumentUpload = () => {
//   const isUploading = ref(false)
//   const uploadProgress = ref(0)
//   const error = ref<string | null>(null)
//   const success = ref(false)

//   const uploadSavingDocument = async (file: File) => {
//     isUploading.value = true
//     error.value = null
//     success.value = false
//     uploadProgress.value = 0

//     try {
//       const formData = new FormData()
//       formData.append('file', file)

//       // Create upload request
//       const response = await document_api.$_upload_saving_document(formData)
      
//       // Simulate progress (in a real app, you'd use axios progress events)
//       const progressInterval = setInterval(() => {
//         uploadProgress.value += 10
//         if (uploadProgress.value >= 100) {
//           clearInterval(progressInterval)
//         }
//       }, 300)

//       success.value = true
//       return response
//     } catch (err) {
//       error.value = err instanceof Error ? err.message : 'Failed to upload document'
//       throw err
//     } finally {
//       isUploading.value = false
//     }
//   }

//   return {
//     isUploading,
//     uploadProgress,
//     error,
//     success,
//     uploadSavingDocument
//   }
// }

import { ref } from 'vue'
// import { useDocumentApi } from '~/api'
import { document_api } from '@/apiFactory/modules/account'

export const useSavingDocumentUpload = () => {
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const success = ref(false)
  const error = ref<string | null>(null)
  // const document_api = useDocumentApi()

  // Fix the uploadSavingDocument function to properly handle the FormData
  const uploadSavingDocument = async (file: File) => {
    isUploading.value = true
    error.value = null
    success.value = false
    uploadProgress.value = 0

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Create upload request
      const response = await document_api.$_upload_saving_document(formData)
      
      // Simulate progress (in a real app, you'd use axios progress events)
      const progressInterval = setInterval(() => {
        uploadProgress.value += 10
        if (uploadProgress.value >= 100) {
          clearInterval(progressInterval)
          // Set success after progress is complete
          success.value = true
        }
      }, 300)

      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to upload document'
      throw err
    } finally {
      // Don't set isUploading to false here, let the progress animation complete first
      // isUploading will be set to false after the progress reaches 100%
      setTimeout(() => {
        isUploading.value = false
      }, 3000); // Ensure this is longer than the progress animation
    }
  }

  return {
    isUploading,
    uploadProgress,
    success,
    error,
    uploadSavingDocument,
  }
}