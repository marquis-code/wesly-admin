<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFetchSavingDetails } from '@/composables/auth/useFetchSavingDetails'
import type { AccountData } from '@/composables/auth/useFetchSavingDetails'

// Page metadata
definePageMeta({
  title: 'Accounts Dashboard',
  layout: 'admin'
})

// Composable
const { loading, savingDetails, error, fetchSavingDetails } = useFetchSavingDetails()

// Reactive state
const activeTab = ref<'customer' | 'savings'>('customer')
const currentPage = ref(0)
const pageSize = ref(10)

// Computed properties
const accounts = computed(() => savingDetails.value?.content || [])
const totalPages = computed(() => savingDetails.value?.totalPages || 0)
const totalElements = computed(() => savingDetails.value?.totalElements || 0)
const isFirstPage = computed(() => savingDetails.value?.first ?? true)
const isLastPage = computed(() => savingDetails.value?.last ?? true)

// Stats computed properties
const activeAccounts = computed(() => 
  accounts.value.filter(acc => acc.accountStatus === 'active' || acc.customerStatus === 'active').length
)

const pendingAccounts = computed(() => 
  accounts.value.filter(acc => acc.accountStatus === 'pending' || acc.customerStatus === 'pending').length
)

const failedAccounts = computed(() => 
  accounts.value.filter(acc => acc.status === 'failed').length
)

// Methods
const switchTab = async (tab: 'customer' | 'savings') => {
  activeTab.value = tab
  currentPage.value = 0
  await fetchData()
}

const fetchData = async () => {
  await fetchSavingDetails(activeTab.value, {
    page: currentPage.value,
    size: pageSize.value
  })
}

const goToPage = async (page: number) => {
  currentPage.value = page
  await fetchData()
}

const nextPage = async () => {
  if (!isLastPage.value) {
    currentPage.value++
    await fetchData()
  }
}

const prevPage = async () => {
  if (!isFirstPage.value) {
    currentPage.value--
    await fetchData()
  }
}

const changePageSize = async (newSize: number) => {
  pageSize.value = newSize
  currentPage.value = 0
  await fetchData()
}

// Utility functions
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

const getFullName = (account: AccountData) => {
  const parts = [account.firstName, account.middleName, account.lastName].filter(Boolean)
  return parts.join(' ')
}

const truncateReason = (reason: string | null, maxLength: number = 50) => {
  if (!reason) return 'N/A'
  return reason.length > maxLength ? reason.substring(0, maxLength) + '...' : reason
}

// Initialize data
onMounted(() => {
  fetchData()
})

</script>

<template>
  <div class="min-h-screen">
    <div class="max-w-7xl mx-auto">
       <!-- Header  -->
      <div class="mb-8">
        <h1 class="text-xl font-bold text-gray-900 mb-2">Accounts Dashboard</h1>
        <p class="text-gray-600">Manage and view your customer and savings accounts</p>
      </div>

       <!-- Tab Navigation  -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="switchTab('customer')"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === 'customer'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Customer Accounts</span>
              </div>
            </button>
            <button
              @click="switchTab('savings')"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === 'savings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Savings Accounts</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

       <!-- Stats Cards  -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Accounts</dt>
                <dd class="text-lg font-medium text-gray-900">{{ totalElements }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active</dt>
                <dd class="text-lg font-medium text-gray-900">{{ activeAccounts }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Pending</dt>
                <dd class="text-lg font-medium text-gray-900">{{ pendingAccounts }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Failed</dt>
                <dd class="text-lg font-medium text-gray-900">{{ failedAccounts }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

       <!-- Error State  -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <div class="mt-2 text-sm text-red-700">{{ error }}</div>
          </div>
        </div>
      </div>

       <!-- Loading State  -->
      <div v-if="loading" class="bg-white rounded-lg shadow">
        <div class="animate-pulse">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div class="p-6 space-y-4">
            <div v-for="i in 5" :key="i" class="flex space-x-4">
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>

       <!-- Accounts Table/Cards  -->
      <div v-else class="bg-white shadow rounded-lg overflow-hidden">
         <!-- Table Header  -->
        <div class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 class="text-lg font-medium text-gray-900 mb-2 sm:mb-0">
            {{ activeTab === 'customer' ? 'Customer' : 'Savings' }} Accounts
          </h3>
          <div class="flex items-center space-x-4">
            <select
              v-model="pageSize"
              @change="changePageSize(pageSize)"
              class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="5">5 per page</option>
              <option :value="10">10 per page</option>
              <option :value="20">20 per page</option>
              <option :value="50">50 per page</option>
            </select>
          </div>
        </div>

         <!-- Desktop Table  -->
        <div v-if="accounts.length > 0" class="hidden lg:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BVN</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="account in accounts" :key="account.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">
                          {{ account.firstName.charAt(0) }}{{ account.lastName.charAt(0) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ getFullName(account) }}</div>
                      <div class="text-sm text-gray-500">ID: {{ account.customerId }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ account.email }}</div>
                  <div class="text-sm text-gray-500">{{ account.phoneNumber }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getStatusColor(account.accountStatus)]">
                    {{ account.accountStatus }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getStatusColor(account.customerStatus)]">
                    {{ account.customerStatus }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ account.bvn }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  <button class="text-gray-600 hover:text-gray-900">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

         <!-- Mobile/Tablet Cards  -->
        <div v-if="accounts.length > 0" class="lg:hidden">
          <div class="space-y-4 p-4">
            <div v-for="account in accounts" :key="account.id" class="bg-gray-50 rounded-lg p-4 space-y-3">
              <div class="flex justify-between items-start">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-700">
                        {{ account.firstName.charAt(0) }}{{ account.lastName.charAt(0) }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ getFullName(account) }}</h4>
                    <p class="text-sm text-gray-500">ID: {{ account.customerId }}</p>
                  </div>
                </div>
                <div class="flex flex-col space-y-1">
                  <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getStatusColor(account.accountStatus)]">
                    {{ account.accountStatus }}
                  </span>
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span class="text-gray-500">Email:</span>
                  <p class="font-medium break-all">{{ account.email }}</p>
                </div>
                <div>
                  <span class="text-gray-500">Phone:</span>
                  <p class="font-medium">{{ account.phoneNumber }}</p>
                </div>
                <div>
                  <span class="text-gray-500">BVN:</span>
                  <p class="font-medium">{{ account.bvn }}</p>
                </div>
                <div>
                  <span class="text-gray-500">Gender:</span>
                  <p class="font-medium">{{ account.gender }}</p>
                </div>
              </div>

              <div class="text-sm">
                <span class="text-gray-500">Address:</span>
                <p class="font-medium">{{ account.address }}</p>
              </div>

              <div v-if="account.reason" class="text-sm">
                <span class="text-gray-500">Reason:</span>
                <p class="font-medium text-red-600" :title="account.reason">{{ truncateReason(account.reason, 100) }}</p>
              </div>
              
              <div class="flex space-x-3 pt-2 border-t border-gray-200">
                <button class="text-blue-600 hover:text-blue-900 text-sm font-medium">View Details</button>
                <button class="text-gray-600 hover:text-gray-900 text-sm font-medium">Edit</button>
              </div>
            </div>
          </div>
        </div>

         <!-- Empty State  -->
        <div v-if="accounts.length === 0 && !loading" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No {{ activeTab }} accounts found</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ activeTab === 'customer' ? 'No customer accounts have been created yet.' : 'No savings accounts have been created yet.' }}
          </p>
          <div class="mt-6">
            <button
              @click="fetchData"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

         <!-- Pagination  -->
        <div v-if="totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="prevPage"
                :disabled="isFirstPage"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                  isFirstPage 
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                ]"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="isLastPage"
                :class="[
                  'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                  isLastPage 
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                ]"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ currentPage * pageSize + 1 }}</span>
                  to
                  <span class="font-medium">{{ Math.min((currentPage + 1) * pageSize, totalElements) }}</span>
                  of
                  <span class="font-medium">{{ totalElements }}</span>
                  results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    @click="prevPage"
                    :disabled="isFirstPage"
                    :class="[
                      'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
                      isFirstPage 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  
                  <template v-for="page in Math.min(totalPages, 5)" :key="page">
                    <button
                      @click="goToPage(page - 1)"
                      :class="[
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                        currentPage === page - 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      ]"
                    >
                      {{ page }}
                    </button>
                  </template>
                  
                  <button
                    @click="nextPage"
                    :disabled="isLastPage"
                    :class="[
                      'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
                      isLastPage 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
