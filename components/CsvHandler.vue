<template>
  <div class="max-w-6xl mx-auto p-4 md:p-6">
    <!-- Page Header -->
    <h1 class="text-2xl font-bold mb-6 transition-all duration-300 animate-fade-in">
      Account Data Management
    </h1>
    
    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up">
      <button 
        @click="showDownloadModal = true" 
        class="bg-primary text-white px-4 py-2 text-sm rounded-full hover:bg-primary-dark transition-all duration-300 flex items-center justify-center transform hover:scale-105"
      >
        <span class="mr-2">Download Template</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
      </button>
      
      <label class="bg-success text-white text-sm px-4 py-2 rounded-full hover:bg-success-dark transition-all duration-300 cursor-pointer flex items-center justify-center transform hover:scale-105">
        <span class="mr-2">Upload CSV/XLSX</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        <input 
          type="file" 
          @change="handleFileUpload" 
          accept=".csv, .xlsx" 
          class="hidden" 
        />
      </label>
    </div>
    
    <!-- Full Screen Loader -->
    <div v-if="isFullScreenLoading" class="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50 animate-fade-in">
      <div class="relative w-24 h-24">
        <div class="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <div class="absolute inset-2 rounded-full border-4 border-t-transparent border-r-primary border-b-transparent border-l-transparent animate-spin-slow"></div>
        <div class="absolute inset-4 rounded-full border-4 border-t-transparent border-r-transparent border-b-primary border-l-transparent animate-spin-slower"></div>
      </div>
      <p class="text-white mt-6 font-medium">{{ loadingMessage }}</p>
      <div class="w-64 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
        <div class="h-full bg-primary rounded-full animate-progress"></div>
      </div>
    </div>
    
    <!-- Inline Loader -->
    <div v-if="loading && !isFullScreenLoading" class="flex flex-col items-center justify-center my-8 animate-fade-in">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p class="mt-4 text-gray-600">Processing your data...</p>
    </div>
    
    <!-- Empty State -->
    <div v-if="!tableData.length && !loading" class="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div class="w-48 h-48 mb-6 text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M14 3v4a1 1 0 0 0 1 1h4"></path><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path><path d="M9 17h6"></path><path d="M9 13h6"></path></svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
      <p class="text-gray-500 text-center max-w-md mb-6">
        Upload a CSV or XLSX file to get started, or download our template to see the required format.
      </p>
      <div class="flex flex-col sm:flex-row gap-4">
        <button 
          @click="showDownloadModal = true" 
          class="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-all duration-300 flex items-center justify-center"
        >
          <span class="mr-2">Get Template</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        </button>
        
        <label class="bg-success text-white px-6 py-2 rounded-full hover:bg-success-dark transition-all duration-300 cursor-pointer flex items-center justify-center">
          <span class="mr-2">Upload File</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          <input 
            type="file" 
            @change="handleFileUpload" 
            accept=".csv, .xlsx" 
            class="hidden" 
          />
        </label>
      </div>
    </div>
    
    <!-- Data Table -->
    <div v-if="tableData.length && !loading" class="mb-6 animate-fade-in relative">
      <div class="overflow-x-auto shadow-md rounded-lg">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-100">
            <tr>
              <th v-for="header in tableHeaders" :key="header" class="sticky top-0 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in tableData" :key="rowIndex" class="hover:bg-gray-50 transition-colors duration-150 animate-fade-in" :style="{ animationDelay: `${rowIndex * 50}ms` }">
              <td 
                v-for="(value, key) in row" 
                :key="key" 
                class="px-4 py-2 text-sm text-gray-900 border-b" 
              >
                <input 
                  v-model="tableData[rowIndex][key]" 
                  class="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200" 
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="mt-6 flex flex-col py-6 sm:flex-row fixed w-full bottom-0 gap-4 animate-slide-up">
        <button 
          @click="saveAndDownload" 
          class="bg-secondary text-white px-4 py-2 rounded-full hover:bg-secondary-dark transition-all duration-300 flex items-center justify-center transform hover:scale-105"
        >
          <span class="mr-2">Save & Download</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        </button>
        
        <button 
          @click="confirmSubmit" 
          class="bg-accent text-white px-4 py-2 rounded-full hover:bg-accent-dark transition-all duration-300 flex items-center justify-center transform hover:scale-105"
        >
          <span class="mr-2">Submit to API</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </button>
      </div>
    </div>
    
    <!-- Error Message -->
    <div v-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 rounded animate-shake" role="alert">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <p>{{ errorMessage }}</p>
      </div>
      <button @click="errorMessage = ''" class="mt-2 text-sm text-red-700 hover:text-red-900 underline">Dismiss</button>
    </div>
    
    <!-- Success Toast -->
    <div v-if="showSuccessToast" class="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg animate-slide-in-right" role="alert">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
        <p>{{ successMessage }}</p>
      </div>
    </div>
    
    <!-- Download Template Modal -->
    <div v-if="showDownloadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 animate-fade-in">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 animate-scale-in">
        <h3 class="text-xl font-bold mb-4">Download Template</h3>
        <p class="mb-6 text-gray-600">
          Download our template file to see the required format for uploading account data. The template includes all necessary columns and example data.
        </p>
        <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-6">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 mr-3"><path d="M14 3v4a1 1 0 0 0 1 1h4"></path><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path><path d="M9 17h6"></path><path d="M9 13h6"></path></svg>
            <div>
              <p class="font-medium">account_template.xlsx</p>
              <p class="text-xs text-gray-500">Excel Spreadsheet</p>
            </div>
          </div>
          <span class="text-xs text-gray-500">12 KB</span>
        </div>
        <div class="flex justify-end gap-3">
          <button 
            @click="showDownloadModal = false" 
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            @click="downloadTemplateFile" 
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center"
          >
            <span class="mr-2">Download</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Confirm Submit Modal -->
    <div v-if="showSubmitModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 animate-fade-in">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 animate-scale-in">
        <h3 class="text-xl font-bold mb-4">Confirm Submission</h3>
        <p class="mb-6 text-gray-600">
          Are you sure you want to submit this data to the API? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button 
            @click="showSubmitModal = false" 
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            @click="submitData" 
            class="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors duration-200 flex items-center"
          >
            <span class="mr-2">Submit</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUploadFile } from '@/composables/auth/useUploadFile'
import * as XLSX from 'xlsx'
import { useFetch } from '#app'

interface AccountData {
  [key: string]: string | number
}

const tableData = ref<AccountData[]>([])
const loading = ref(false)
const errorMessage = ref('')
const isFullScreenLoading = ref(false)
const loadingMessage = ref('Processing your request...')
const showSuccessToast = ref(false)
const successMessage = ref('')
const showDownloadModal = ref(false)
const showSubmitModal = ref(false)
const processingFileUpload = ref(false) // Add this line

// Automatically hide success toast after 5 seconds
watch(showSuccessToast, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      showSuccessToast.value = false
    }, 5000)
  }
})

const tableHeaders = computed(() => {
  if (tableData.value.length === 0) return []
  return Object.keys(tableData.value[0])
})

const downloadTemplateFile = () => {
  showDownloadModal.value = false
  isFullScreenLoading.value = true
  loadingMessage.value = 'Preparing template for download...'
  
  setTimeout(() => {
    const link = document.createElement('a')
    link.href = '/account_template.xlsx'
    link.download = 'account_template.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    isFullScreenLoading.value = false
    showSuccessToast.value = true
    successMessage.value = 'Template downloaded successfully!'
  }, 1500) // Simulate download delay
}

const handleFileUpload = async (event: Event) => {
  const fileInput = event.target as HTMLInputElement
  const file = fileInput?.files?.[0]
  
  if (!file) return
  
  try {
    isFullScreenLoading.value = true
    loadingMessage.value = 'Uploading and processing your file...'
    errorMessage.value = ''
    processingFileUpload.value = true
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    
    if (fileExtension !== 'csv' && fileExtension !== 'xlsx') {
      throw new Error('Please upload a CSV or XLSX file')
    }
    
    // Simulate file upload to backend
    setTimeout(async () => {
      loadingMessage.value = 'Parsing data...'
      
      try {
        const fileData = await readFileContent(file)
        
        // Simulate API processing
        setTimeout(() => {
          tableData.value = fileData
          isFullScreenLoading.value = false
          showSuccessToast.value = true
          successMessage.value = 'File processed successfully!'
          processingFileUpload.value = false
          
          // Reset file input
          if (fileInput) fileInput.value = ''
        }, 1500)
      } catch (error) {
        isFullScreenLoading.value = false
        processingFileUpload.value = false
        throw error
      }
    }, 2000)
  } catch (error) {
    isFullScreenLoading.value = false
    processingFileUpload.value = false
    errorMessage.value = error instanceof Error ? error.message : 'Error processing file'
  }
}

const readFileContent = (file: File): Promise<AccountData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const fileContent = e.target?.result
        if (!fileContent) {
          reject(new Error('Failed to read file content'))
          return
        }
        
        const fileExtension = file.name.split('.').pop()?.toLowerCase()
        let parsedData: AccountData[] = []
        
        if (fileExtension === 'csv') {
          parsedData = parseCSV(fileContent as string)
        } else if (fileExtension === 'xlsx') {
          parsedData = parseXLSX(fileContent)
        }
        
        resolve(parsedData)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  })
}

const parseCSV = (csvContent: string): AccountData[] => {
  const lines = csvContent.split('\n')
  const headers = lines[0].split(',').map(header => header.trim())
  
  const data: AccountData[] = []
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue
    
    const values = lines[i].split(',').map(value => value.trim())
    const row: AccountData = {}
    
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    
    data.push(row)
  }
  
  return data
}

const parseXLSX = (content: string | ArrayBuffer): AccountData[] => {
  const workbook = XLSX.read(content, { type: 'array' })
  const firstSheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[firstSheetName]
  
  // Convert sheet to JSON with header row
  const data = XLSX.utils.sheet_to_json<AccountData>(worksheet, { header: 1 })
  
  if (data.length < 2) {
    throw new Error('Invalid XLSX file format')
  }
  
  const headers = data[0] as string[]
  const rows = data.slice(1) as Array<Array<string | number>>
  
  return rows.map(row => {
    const rowData: AccountData = {}
    headers.forEach((header, index) => {
      rowData[header] = row[index] || ''
    })
    return rowData
  })
}

const saveAndDownload = () => {
  try {
    isFullScreenLoading.value = true
    loadingMessage.value = 'Preparing your file for download...'
    
    setTimeout(() => {
      try {
        // Create workbook and worksheet
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(tableData.value)
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Accounts')
        
        // Generate file and trigger download
        XLSX.writeFile(wb, 'updated_accounts.xlsx')
        
        isFullScreenLoading.value = false
        showSuccessToast.value = true
        successMessage.value = 'File saved and downloaded successfully!'
      } catch (error) {
        isFullScreenLoading.value = false
        errorMessage.value = error instanceof Error ? error.message : 'Error saving file'
      }
    }, 1500)
  } catch (error) {
    isFullScreenLoading.value = false
    errorMessage.value = error instanceof Error ? error.message : 'Error saving file'
  }
}

const confirmSubmit = () => {
  showSubmitModal.value = true
}

const submitData = async () => {
  showSubmitModal.value = false
  
  try {
    isFullScreenLoading.value = true
    loadingMessage.value = 'Submitting data to API...'
    errorMessage.value = ''
    
    // Simulate API call with delay
    setTimeout(async () => {
      try {
        // Replace with your actual API endpoint
        const { data, error } = await useFetch('/api/accounts', {
          method: 'POST',
          body: tableData.value
        })
        
        if (error.value) {
          throw new Error('Failed to submit data to API')
        }
        
        isFullScreenLoading.value = false
        showSuccessToast.value = true
        successMessage.value = 'Data successfully submitted to API!'
      } catch (error) {
        isFullScreenLoading.value = false
        errorMessage.value = error instanceof Error ? error.message : 'Error submitting data'
      }
    }, 2000)
  } catch (error) {
    isFullScreenLoading.value = false
    errorMessage.value = error instanceof Error ? error.message : 'Error submitting data'
  }
}
</script>

<style>
/* Custom animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes scale-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes progress {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out;
}

.animate-slide-in-right {
  animation: slide-in-right 0.5s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-progress {
  animation: progress 2.5s ease-in-out forwards;
}

.animate-spin-slow {
  animation: spin 1.5s linear infinite;
}

.animate-spin-slower {
  animation: spin 2s linear infinite;
}

/* Custom colors */
:root {
  --color-primary: #6366f1;
  --color-primary-dark: #4f46e5;
  --color-secondary: #8b5cf6;
  --color-secondary-dark: #7c3aed;
  --color-accent: #ec4899;
  --color-accent-dark: #db2777;
  --color-success: #10b981;
  --color-success-dark: #059669;
}

.bg-primary {
  background-color: var(--color-primary);
}

.bg-primary-dark {
  background-color: var(--color-primary-dark);
}

.bg-secondary {
  background-color: var(--color-secondary);
}

.bg-secondary-dark {
  background-color: var(--color-secondary-dark);
}

.bg-accent {
  background-color: var(--color-accent);
}

.bg-accent-dark {
  background-color: var(--color-accent-dark);
}

.bg-success {
  background-color: var(--color-success);
}

.bg-success-dark {
  background-color: var(--color-success-dark);
}

.text-primary {
  color: var(--color-primary);
}

.border-primary {
  border-color: var(--color-primary);
}

.focus\:ring-primary:focus {
  --tw-ring-color: var(--color-primary);
}
</style>