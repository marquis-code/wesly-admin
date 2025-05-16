<template>
  <div class="min-h-screen px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header with animation -->
      <div class="text-start mb-10 reveal-animation">
        <h1 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
          Document Management
        </h1>
        <p class="mt-4 text-start max-w-2xl text-lg text-gray-600 sm:mt-5">
          Upload, download, and manage your customer and savings documents
        </p>
      </div>

      <!-- Animated Tabs -->
      <div class="mb-12 reveal-animation" style="animation-delay: 0.2s">
        <div class="sm:hidden">
          <select 
            v-model="activeTab" 
            class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
          >
            <option value="customer">Customer Documents</option>
            <option value="savings">Savings Documents</option>
          </select>
        </div>
        <div class="hidden sm:block">
          <div class="relative">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-12" aria-label="Tabs">
                <button
                  v-for="tab in tabs"
                  :key="tab.name"
                  @click="activeTab = tab.value"
                  class="tab-button whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ease-in-out"
                  :class="[
                    activeTab === tab.value
                      ? 'border-rose-500 text-rose-600 font-semibold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  {{ tab.name }}
                </button>
              </nav>
            </div>
            <!-- Animated indicator -->
            <div 
              class="absolute bottom-0 h-0.5 bg-gradient-to-r from-rose-500 to-purple-600 transition-all duration-300 ease-in-out"
              :style="{ 
                left: activeTabPosition + 'px', 
                width: activeTabWidth + 'px' 
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Content Card with Animation -->
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden reveal-animation" style="animation-delay: 0.4s">
        <div class="px-6 py-8 sm:p-8">
          <!-- Download Template Section -->
          <div class="mb-12 card-section-animation">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span class="icon-circle bg-rose-100 p-2 rounded-full mr-3">
                <svg class="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </span>
              Download Template
            </h2>
            <p class="text-sm text-gray-600 mb-5 ml-10">
              Download the Excel template, fill it with your data, and upload it back to the system.
            </p>
            <div class="ml-10">
              <button
                @click="downloadTemplate"
                :disabled="isDownloading"
                class="download-button inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full shadow-md text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-300"
              >
                <span v-if="isDownloading" class="mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span>Download {{ activeTab === 'customer' ? 'Customer' : 'Savings' }} Template</span>
              </button>
            </div>
          </div>

          <!-- Upload Section -->
          <div class="mb-12 card-section-animation" style="animation-delay: 0.2s">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span class="icon-circle bg-purple-100 p-2 rounded-full mr-3">
                <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </span>
              Upload Document
            </h2>
            <div 
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              :class="[
                'ml-10 mt-5 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed rounded-xl transition-all duration-300',
                isDragging ? 'border-rose-400 bg-rose-50 scale-102' : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50',
                (isUploading || uploadSuccess) ? 'bg-gray-50' : ''
              ]"
            >
              <div class="space-y-1 text-center">
                <div v-if="isUploading" class="flex flex-col items-center upload-progress-animation">
                  <svg class="animate-spin h-12 w-12 text-rose-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div class="w-64 bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
                    <div 
                      class="h-full rounded-full bg-gradient-to-r from-rose-500 to-purple-600 transition-all duration-300 ease-out" 
                      :style="{ width: `${uploadProgress}%` }"
                    ></div>
                  </div>
                  <p class="text-sm text-gray-600">Uploading... {{ uploadProgress }}%</p>
                </div>
                
                <div v-else-if="uploadSuccess" class="flex flex-col items-center success-animation">
                  <div class="success-checkmark">
                    <div class="check-icon">
                      <span class="icon-line line-tip"></span>
                      <span class="icon-line line-long"></span>
                    </div>
                  </div>
                  <p class="text-sm text-green-600 font-medium mt-2">Upload successful!</p>
                  <button 
                    @click="resetUpload"
                    class="mt-4 text-sm text-rose-600 hover:text-rose-800 font-medium transition-colors duration-200"
                  >
                    Upload another file
                  </button>
                </div>
                
                <div v-else class="flex flex-col items-center upload-area-animation">
                  <div class="upload-icon-container mb-4">
                    <svg class="h-16 w-16 text-gray-400 upload-icon" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div class="flex text-sm text-gray-600">
                    <label 
                      for="file-upload" 
                      class="relative cursor-pointer bg-white rounded-md font-medium text-rose-600 hover:text-rose-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-rose-500 transition-colors duration-200"
                    >
                      <span>Upload a file</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        class="sr-only" 
                        accept=".xlsx,.xls"
                        @change="handleFileChange"
                      >
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500 mt-2">
                    Excel files only (.xlsx, .xls)
                  </p>
                </div>
              </div>
            </div>
            
            <div v-if="uploadError" class="mt-3 ml-10 text-sm text-red-600 error-animation">
              {{ uploadError }}
            </div>
            
            <div v-if="selectedFile && !isUploading && !uploadSuccess" class="mt-5 ml-10 flex items-center file-selected-animation">
              <div class="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div class="flex items-center">
                  <div class="bg-purple-100 p-2 rounded-full">
                    <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                  </div>
                </div>
              </div>
              <button 
                @click="uploadFile"
                class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-300"
              >
                Upload
              </button>
            </div>
          </div>

          <!-- Documents Table -->
          <div class="card-section-animation" style="animation-delay: 0.4s">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span class="icon-circle bg-rose-100 p-2 rounded-full mr-3">
                <svg class="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </span>
              {{ activeTab === 'customer' ? 'Customer' : 'Savings' }} Documents
            </h2>
            
            <div v-if="isLoadingDocuments" class="flex justify-center py-12 loading-animation">
              <div class="loader">
                <div class="dot-pulse"></div>
              </div>
            </div>
            
            <div v-else-if="documents.length === 0" class="text-center py-12 bg-gray-50 rounded-xl empty-state-animation">
              <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900">No documents</h3>
              <p class="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                No {{ activeTab === 'customer' ? 'customer' : 'savings' }} documents are available at this time.
              </p>
            </div>
            
            <div v-else class="flex flex-col table-animation">
              <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div class="shadow-sm overflow-hidden border border-gray-200 sm:rounded-xl">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {{ activeTab === 'customer' ? 'Customer' : 'Account' }}
                          </th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            BVN
                          </th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" class="relative px-6 py-3">
                            <span class="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr 
                          v-for="(document, index) in documents" 
                          :key="document.id" 
                          class="table-row-animation hover:bg-gray-50 transition-colors duration-150"
                          :style="{ animationDelay: `${0.1 * index}s` }"
                        >
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                              <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-purple-100 rounded-full text-purple-700 font-bold">
                                {{ document.firstName?.charAt(0) || 'A' }}{{ document.lastName?.charAt(0) || 'U' }}
                              </div>
                              <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">
                                  {{ document.firstName || '' }} {{ document.middleName || '' }} {{ document.lastName || '' }}
                                </div>
                                <div class="text-sm text-gray-500">
                                  ID: {{ document.customerId || document.id }}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ document.email || 'N/A' }}</div>
                            <div class="text-sm text-gray-500">{{ document.phoneNumber || 'N/A' }}</div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ document.bvn || 'N/A' }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span 
                              class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                              :class="getStatusClass(document.status)"
                            >
                              {{ document.status || 'Unknown' }}
                            </span>
                            <div v-if="document.status === 'failed'" class="mt-1">
                              <button 
                                @click="toggleReason(document.id)" 
                                class="text-xs text-rose-600 hover:text-rose-800"
                              >
                                {{ expandedReasons.includes(document.id) ? 'Hide reason' : 'Show reason' }}
                              </button>
                              <div 
                                v-if="expandedReasons.includes(document.id)" 
                                class="mt-2 text-xs text-gray-500 max-w-xs reason-animation"
                              >
                                {{ getSimplifiedReason(document.reason) }}
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              @click="previewDocument(document)"
                              class="text-rose-600 hover:text-rose-800 mr-4 transition-colors duration-200"
                            >
                              Preview
                            </button>
                            <button 
                              @click="downloadDocument(document)"
                              class="text-purple-600 hover:text-purple-800 transition-colors duration-200"
                              :disabled="isDownloading === document.id"
                            >
                              <span v-if="isDownloading === document.id" class="inline-flex items-center">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Downloading...
                              </span>
                              <span v-else>Download</span>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal with Animation -->
    <Teleport to="body">
      <div 
        v-if="showPreview" 
        class="fixed inset-0 z-10 overflow-y-auto"
        aria-labelledby="modal-title" 
        role="dialog" 
        aria-modal="true"
      >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div 
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity modal-backdrop" 
            aria-hidden="true"
            @click="showPreview = false"
          ></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6 modal-content">
            <div class="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                @click="showPreview = false"
                class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors duration-200"
              >
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-bold text-gray-900 modal-title-animation" id="modal-title">
                  {{ activeTab === 'customer' ? 'Customer' : 'Savings' }} Details
                </h3>
                
                <div v-if="previewingDocument" class="mt-4 bg-gray-50 p-6 rounded-lg overflow-auto max-h-96 modal-content-animation">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Personal Information -->
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <h4 class="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">Personal Information</h4>
                      <div class="space-y-2">
                        <div class="flex justify-between">
                          <span class="text-xs text-gray-500">Full Name:</span>
                          <span class="text-sm font-medium">{{ previewingDocument.firstName || '' }} {{ previewingDocument.middleName || '' }} {{ previewingDocument.lastName || '' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-xs text-gray-500">Gender:</span>
                          <span class="text-sm">{{ previewingDocument.gender || 'N/A' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-xs text-gray-500">Date of Birth:</span>
                          <span class="text-sm">{{ formatDate(previewingDocument.dob) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-xs text-gray-500">Address:</span>
                          <span class="text-sm">{{ previewingDocument.address || 'N/A' }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Contact Information -->
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <h4 class="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">Contact Information</h4>
                      <div class="space-y-2">
                        <div class="flex justify-between">
                          <span class="text-xs text-gray-500">Email:</span>
                          <span class="text-sm">{{ previewingDocument.email || 'N/A' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-xs text-gray-500">Phone Number:</span>
                          <span class="text-sm">{{ previewingDocument.phoneNumber || 'N/A' }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Account Information -->
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <h4 class="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">Account Information</h4>
                      <div class="space-y-2">
                        <div class="flex justify-between">
                          <span class="text-xs text-gray-500">{{ activeTab === 'customer' ? 'Customer' : 'Account' }} ID:</span>
                          <span class="text-sm">{{ previewingDocument.customerId || previewingDocument.id || 'N/A' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-xs text-gray-500">BVN:</span>
                          <span class="text-sm">{{ previewingDocument.bvn || 'N/A' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-xs text-gray-500">NIN:</span>
                          <span class="text-sm">{{ previewingDocument.nin === 'NULL' ? 'Not provided' : (previewingDocument.nin || 'N/A') }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Status Information -->
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <h4 class="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">Status Information</h4>
                      <div class="space-y-2">
                        <div class="flex justify-between">
                          <span class="text-xs text-gray-500">Account Status:</span>
                          <span 
                            class="text-sm px-2 py-0.5 rounded-full text-xs"
                            :class="getStatusBadgeClass(previewingDocument.accountStatus)"
                          >
                            {{ previewingDocument.accountStatus || 'N/A' }}
                          </span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-xs text-gray-500">{{ activeTab === 'customer' ? 'Customer' : 'Savings' }} Status:</span>
                          <span 
                            class="text-sm px-2 py-0.5 rounded-full text-xs"
                            :class="getStatusBadgeClass(previewingDocument.customerStatus)"
                          >
                            {{ previewingDocument.customerStatus || 'N/A' }}
                          </span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-xs text-gray-500">Overall Status:</span>
                          <span 
                            class="text-sm px-2 py-0.5 rounded-full text-xs"
                            :class="getStatusBadgeClass(previewingDocument.status)"
                          >
                            {{ previewingDocument.status || 'N/A' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Error Reason (if failed) -->
                  <div v-if="previewingDocument.status === 'failed'" class="mt-6 bg-red-50 p-4 rounded-lg border border-red-100">
                    <h4 class="text-sm font-semibold text-red-700 mb-2">Failure Reason</h4>
                    <p class="text-xs text-red-600 whitespace-pre-wrap">{{ getSimplifiedReason(previewingDocument.reason) }}</p>
                  </div>
                  
                  <div class="mt-6 flex justify-end">
                    <button 
                      @click="downloadDocument(previewingDocument)"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-300"
                      :disabled="isDownloading === previewingDocument.id"
                    >
                      <span v-if="isDownloading === previewingDocument.id" class="inline-flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      </span>
                      <span v-else>
                        <svg class="-ml-1 mr-2 h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Download as Excel
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { definePageMeta } from '#imports'

// Define types
type DocumentType = 'customer' | 'savings'
type Document = {
  id: number
  accountStatus?: string
  address?: string
  branch?: string | null
  bvn?: string
  customerId?: string
  customerStatus?: string
  dob?: string
  email?: string
  firstName?: string
  gender?: string
  lastName?: string
  middleName?: string
  nin?: string
  phoneNumber?: string
  productType?: string | null
  reason?: string
  userId?: string | null
  status?: string
  username?: string
  createdAt?: string | null
  updatedAt?: string | null
  [key: string]: any // Allow for additional properties
}

// Tabs
const tabs = [
  { name: 'Customer Documents', value: 'customer' },
  { name: 'Savings Documents', value: 'savings' }
]
const activeTab = ref<DocumentType>('customer')
const activeTabPosition = ref(0)
const activeTabWidth = ref(0)

// Document lists
const customerDocuments = ref<Document[]>([])
const savingsDocuments = ref<Document[]>([])
const isLoadingCustomerDocuments = ref(false)
const isLoadingSavingsDocuments = ref(false)

// Computed properties for current state based on active tab
const documents = computed(() => 
  activeTab.value === 'customer' ? customerDocuments.value : savingsDocuments.value
)

const isLoadingDocuments = computed(() => 
  activeTab.value === 'customer' ? isLoadingCustomerDocuments.value : isLoadingSavingsDocuments.value
)

// Template download
const isDownloading = ref(false)

// File upload
const isDragging = ref(false)
const selectedFile = ref<File | null>(null)
const uploadError = ref<string | null>(null)
const uploadSuccess = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)

// Preview modal
const showPreview = ref(false)
const previewingDocument = ref<Document | null>(null)
const expandedReasons = ref<number[]>([])

// API functions using fetch
const getAuthToken = (): string => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Authentication token not found')
  }
  return token
}

const getAuthHeaders = (): HeadersInit => {
  return {
    'Authorization': `Bearer ${getAuthToken()}`
  }
}

const fetchDocuments = async (type: DocumentType) => {
  try {
    if (type === 'customer') {
      isLoadingCustomerDocuments.value = true
    } else {
      isLoadingSavingsDocuments.value = true
    }

    const response = await fetch(`https://easypay-api.wesleymfb.com/api/auth/providers/get-file?type=${type}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} documents: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (type === 'customer') {
      customerDocuments.value = data?.data?.content
    } else {
      savingsDocuments.value = data?.data?.content
    }
  } catch (error) {
    console.error(`Error fetching ${type} documents:`, error)
  } finally {
    if (type === 'customer') {
      isLoadingCustomerDocuments.value = false
    } else {
      isLoadingSavingsDocuments.value = false
    }
  }
}

const downloadTemplate = async () => {
  try {
    isDownloading.value = true
    
    const response = await fetch(`https://easypay-api.wesleymfb.com/api/auth/providers/template?type=${activeTab.value}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error(`Failed to download template: ${response.statusText}`)
    }

    // Create a blob from the response
    const blob = await response.blob()
    
    // Create a download link and trigger download
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = `${activeTab.value}_template.xlsx`
    document.body.appendChild(a)
    a.click()
    
    // Clean up
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Error downloading template:', error)
    alert('Failed to download template. Please try again.')
  } finally {
    isDownloading.value = false
  }
}

const uploadFile = async () => {
  if (!selectedFile.value) return
  
  try {
    isUploading.value = true
    uploadProgress.value = 0
    uploadError.value = null
    
    // Create FormData
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    
    // Create XMLHttpRequest to track upload progress
    const xhr = new XMLHttpRequest()
    
    // Setup progress tracking
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        uploadProgress.value = Math.round((event.loaded / event.total) * 100)
      }
    })
    
    // Setup promise to handle completion
    const uploadPromise = new Promise<void>((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`))
        }
      }
      
      xhr.onerror = () => {
        reject(new Error('Network error occurred during upload'))
      }
    })
    
    // Open and send request
    xhr.open('POST', `https://easypay-api.wesleymfb.com/api/auth/providers/upload-file?type=${activeTab.value}`)
    xhr.setRequestHeader('Authorization', `Bearer ${getAuthToken()}`)
    xhr.send(formData)
    
    // Wait for completion
    await uploadPromise
    
    // Simulate a slight delay for better UX
    setTimeout(() => {
      uploadSuccess.value = true
      isUploading.value = false
      
      // Refresh document list
      fetchDocuments(activeTab.value)
    }, 500)
    
  } catch (error) {
    console.error('Error uploading file:', error)
    uploadError.value = error instanceof Error ? error.message : 'Upload failed'
    isUploading.value = false
  }
}

const downloadDocument = async (document: Document) => {
  try {
    isDownloading.value = document.id
    
    const response = await fetch(`https://easypay-api.wesleymfb.com/api/auth/providers/download?id=${document.id}&type=${activeTab.value}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`Failed to download document: ${response.statusText}`)
    }
    
    const blob = await response.blob()
    
    // Create a download link and trigger download
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = `${activeTab.value}_${document.id || document.customerId}.xlsx`
    document.body.appendChild(a)
    a.click()
    
    // Clean up
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
  } catch (error) {
    console.error('Error downloading document:', error)
    alert('Failed to download document. Please try again.')
  } finally {
    isDownloading.value = null
  }
}

// Methods
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0]
    uploadError.value = null
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragging.value = false
  
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    
    // Check if file is Excel
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.type === 'application/vnd.ms-excel') {
      selectedFile.value = file
      uploadError.value = null
    } else {
      uploadError.value = 'Please upload an Excel file (.xlsx, .xls)'
    }
  }
}

const resetUpload = () => {
  selectedFile.value = null
  uploadError.value = null
  uploadSuccess.value = false
}

const previewDocument = (document: Document) => {
  previewingDocument.value = document
  showPreview.value = true
}

const toggleReason = (documentId: number) => {
  if (expandedReasons.value.includes(documentId)) {
    expandedReasons.value = expandedReasons.value.filter(id => id !== documentId)
  } else {
    expandedReasons.value.push(documentId)
  }
}

// Update tab indicator position
const updateTabIndicator = async () => {
  await nextTick()
  const activeTabElement = document.querySelector('.tab-button.border-rose-500') as HTMLElement
  if (activeTabElement) {
    activeTabPosition.value = activeTabElement.offsetLeft
    activeTabWidth.value = activeTabElement.offsetWidth
  }
}

// Helper functions
const getStatusClass = (status?: string): string => {
  if (!status) return 'bg-gray-100 text-gray-800'
  
  switch (status.toLowerCase()) {
    case 'success':
    case 'completed':
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'pending':
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
    case 'error':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusBadgeClass = (status?: string): string => {
  if (!status) return 'bg-gray-100 text-gray-800'
  
  switch (status.toLowerCase()) {
    case 'success':
    case 'completed':
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'pending':
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
    case 'error':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getSimplifiedReason = (reason?: string): string => {
  if (!reason) return 'Unknown error'
  
  // Extract the most relevant part of the error message
  if (reason.includes('defaultUserMessage')) {
    try {
      // Try to extract the defaultUserMessage from the JSON-like string
      const match = reason.match(/"defaultUserMessage"\s*:\s*"([^"]+)"/)
      if (match && match[1]) {
        return match[1]
      }
    } catch (e) {
      // If parsing fails, fall back to the original message
    }
  }
  
  // If we couldn't extract a specific message, return a simplified version
  if (reason.length > 100) {
    return reason.substring(0, 100) + '...'
  }
  
  return reason
}

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Watch for tab changes to refresh data and update indicator
watch(activeTab, () => {
  fetchDocuments(activeTab.value)
  updateTabIndicator()
  
  // Reset upload state when switching tabs
  resetUpload()
})

onMounted(() => {
  // Initial data fetch for both tabs
  fetchDocuments('customer')
  fetchDocuments('savings')
  
  // Initialize tab indicator
  updateTabIndicator()
  
  // Add scroll reveal animations
  const revealElements = document.querySelectorAll('.reveal-animation')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })
  
  revealElements.forEach(el => {
    observer.observe(el)
  })
})

definePageMeta({
  title: 'Document Management',
  layout: 'admin'
})
</script>

<style scoped>
/* Animation Keyframes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes checkmark {
  0% {
    height: 0;
    width: 0;
    opacity: 0;
  }
  40% {
    height: 0;
    width: 8px;
    opacity: 1;
  }
  100% {
    height: 16px;
    width: 8px;
    opacity: 1;
  }
}

/* Animation Classes */
.reveal-animation {
  opacity: 0;
  transform: translateY(20px);
}

.revealed {
  animation: fadeInUp 0.6s ease-out forwards;
}

.card-section-animation {
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}

.upload-area-animation {
  transition: all 0.3s ease;
}

.upload-area-animation:hover .upload-icon {
  color: #f43f5e;
  transform: scale(1.05);
  transition: all 0.3s ease;
}

.upload-icon-container {
  animation: float 6s ease-in-out infinite;
}

.upload-progress-animation {
  animation: fadeIn 0.5s ease-out;
}

.success-animation {
  animation: fadeIn 0.5s ease-out;
}

.file-selected-animation {
  animation: fadeInUp 0.4s ease-out;
}

.error-animation {
  animation: fadeIn 0.3s ease-out;
}

.table-animation {
  animation: fadeIn 0.6s ease-out;
}

.table-row-animation {
  opacity: 0;
  animation: slideInRight 0.4s ease-out forwards;
}

.empty-state-animation {
  animation: pulse 2s ease-in-out infinite;
}

.modal-backdrop {
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  animation: fadeInUp 0.4s ease-out;
}

.modal-title-animation {
  animation: fadeInUp 0.5s ease-out;
}

.modal-content-animation {
  animation: fadeInUp 0.6s ease-out;
}

.reason-animation {
  animation: fadeIn 0.3s ease-out;
}

/* Dot Pulse Animation */
@keyframes dotPulse {
  0% {
    box-shadow: 9999px 0 0 -5px;
  }
  30% {
    box-shadow: 9999px 0 0 2px;
  }
  60%, 100% {
    box-shadow: 9999px 0 0 -5px;
  }
}

@keyframes dotPulseBefore {
  0% {
    box-shadow: 9984px 0 0 -5px;
  }
  30% {
    box-shadow: 9984px 0 0 2px;
  }
  60%, 100% {
    box-shadow: 9984px 0 0 -5px;
  }
}

@keyframes dotPulseAfter {
  0% {
    box-shadow: 10014px 0 0 -5px;
  }
  30% {
    box-shadow: 10014px 0 0 2px;
  }
  60%, 100% {
    box-shadow: 10014px 0 0 -5px;
  }
}

.dot-pulse {
  position: relative;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #f43f5e;
  color: #f43f5e;
  box-shadow: 9999px 0 0 -5px;
  animation: dotPulse 1.5s infinite linear;
  animation-delay: 0.25s;
}

.dot-pulse::before, .dot-pulse::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #f43f5e;
  color: #f43f5e;
}

.dot-pulse::before {
  box-shadow: 9984px 0 0 -5px;
  animation: dotPulseBefore 1.5s infinite linear;
  animation-delay: 0s;
}

.dot-pulse::after {
  box-shadow: 10014px 0 0 -5px;
  animation: dotPulseAfter 1.5s infinite linear;
  animation-delay: 0.5s;
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}

/* Scale effect for drag and drop */
.scale-102 {
  transform: scale(1.02);
}

/* Icon circle styling */
.icon-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

/* Tab indicator transition */
.tab-button {
  position: relative;
  transition: all 0.3s ease;
}

.tab-button:hover {
  transform: translateY(-2px);
}

/* Success Checkmark Animation */
.success-checkmark {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  position: relative;
}

.check-icon {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 50%;
  box-sizing: content-box;
  border: 4px solid #4BB543;
}

.check-icon::before {
  top: 3px;
  left: -2px;
  width: 30px;
  transform-origin: 100% 50%;
  border-radius: 100px 0 0 100px;
}

.check-icon::after {
  top: 0;
  left: 30px;
  width: 60px;
  transform-origin: 0 50%;
  border-radius: 0 100px 100px 0;
}

.check-icon::before, .check-icon::after {
  content: '';
  height: 100px;
  position: absolute;
  background: #FFFFFF;
  transform: rotate(-45deg);
}

.check-icon .icon-line {
  height: 5px;
  background-color: #4BB543;
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 10;
}

.check-icon .icon-line.line-tip {
  top: 46px;
  left: 14px;
  width: 25px;
  transform: rotate(45deg);
  animation: checkmark 0.25s ease-in-out 0.25s forwards;
}

.check-icon .icon-line.line-long {
  top: 38px;
  right: 8px;
  width: 47px;
  transform: rotate(-45deg);
  animation: checkmark 0.25s ease-in-out 0.4s forwards;
}
</style>