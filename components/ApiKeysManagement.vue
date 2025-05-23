<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header with animation -->
      <div class="text-center mb-8 fade-in-up">
        <h1 class="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
          API Keys Management
        </h1>
        <p class="mt-3 text-gray-600">
          Manage your API keys for secure integration with our payment services
        </p>
      </div>

      <!-- Provider Tabs -->
      <div class="mb-8 fade-in-up" style="animation-delay: 100ms">
        <div class="flex justify-center">
          <div class="bg-white rounded-full shadow-md p-1 inline-flex relative">
            <!-- Tab indicator -->
            <div 
              class="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 transition-all duration-300 ease-out tab-indicator"
              :style="{ 
                left: activeProviderPosition + 'px', 
                width: activeProviderWidth + 'px' 
              }"
            ></div>
            
            <!-- NIP Tab -->
            <button 
              ref="nipTabRef"
              @click="handleProviderChange('nip')"
              class="relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300"
              :class="activeProvider === 'nip' ? 'text-white' : 'text-gray-700 hover:text-gray-900'"
            >
              <div class="flex items-center">
                <ServerIcon class="w-4 h-4 mr-2" />
                <span>NIP</span>
              </div>
            </button>
            
            <!-- Easy Pay Tab -->
            <button 
              ref="easyPayTabRef"
              @click="handleProviderChange('easyPay')"
              class="relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300"
              :class="activeProvider === 'easyPay' ? 'text-white' : 'text-gray-700 hover:text-gray-900'"
            >
              <div class="flex items-center">
                <CreditCardIcon class="w-4 h-4 mr-2" />
                <span>Easy Pay</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Environment Tabs -->
      <div class="mb-8 fade-in-up" style="animation-delay: 200ms">
        <div class="flex justify-center">
          <div class="bg-white rounded-full shadow-md p-1 inline-flex relative">
            <!-- Tab indicator -->
            <div 
              class="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-rose-400 to-purple-500 transition-all duration-300 ease-out tab-indicator"
              :style="{ 
                left: activeEnvironmentPosition + 'px', 
                width: activeEnvironmentWidth + 'px' 
              }"
            ></div>
            
            <!-- Staging Tab -->
            <button 
              ref="stagingTabRef"
              @click="handleEnvironmentChange('staging')"
              class="relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300"
              :class="activeEnvironment === 'staging' ? 'text-white' : 'text-gray-700 hover:text-gray-900'"
            >
              <div class="flex items-center">
                <BeakerIcon class="w-4 h-4 mr-2" />
                <span>Staging</span>
              </div>
            </button>
            
            <!-- Live Tab -->
            <button 
              ref="liveTabRef"
              @click="handleEnvironmentChange('live')"
              class="relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300"
              :class="activeEnvironment === 'live' ? 'text-white' : 'text-gray-700 hover:text-gray-900'"
            >
              <div class="flex items-center">
                <GlobeIcon class="w-4 h-4 mr-2" />
                <span>Live</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-8 fade-in-up" style="animation-delay: 300ms">
        <div class="flex flex-wrap justify-center gap-3">
          <!-- <button 
            @click="openPasswordModal" 
            class="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:text-rose-600 shadow-sm hover:shadow transition-all duration-200 scale-hover"
          >
            <LockIcon class="w-4 h-4 mr-2" />
            <span>Update Password</span>
          </button> -->
<!--           
          <button 
            class="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:text-purple-600 shadow-sm hover:shadow transition-all duration-200 scale-hover"
          >
            <LinkIcon class="w-4 h-4 mr-2" />
            <span>Show API URLs</span>
          </button>
          
          <button 
            class="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:text-rose-600 shadow-sm hover:shadow transition-all duration-200 scale-hover"
          >
            <KeyIcon class="w-4 h-4 mr-2" />
            <span>JWT Public Key</span>
          </button> -->
          
          <button 
            @click="openSaveChangesModal" 
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full text-sm font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 scale-hover"
            :class="{'opacity-50 cursor-not-allowed': !hasUnsavedChanges}"
            :disabled="!hasUnsavedChanges"
          >
            <SaveIcon class="w-4 h-4 mr-2" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <!-- API Keys Sections -->
      <div class="space-y-6">
        <!-- Base URL -->
        <div v-show="activeProvider === 'easyPay'" class="bg-white rounded-xl shadow-sm overflow-hidden card-animation" style="animation-delay: 400ms">
          <div class="flex items-center justify-between bg-gradient-to-r from-rose-50 to-purple-50 px-6 py-4 border-b border-gray-100">
            <div class="flex items-center">
              <h3 class="text-lg font-medium text-gray-900">Base URL</h3>
              <div class="relative ml-2 group">
                <HelpCircleIcon class="w-5 h-5 text-gray-400 cursor-help" />
                <div class="absolute left-0 bottom-full mb-2 w-64 bg-gray-900 text-white text-sm rounded-md p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                  <div class="absolute left-0 bottom-[-6px] transform translate-x-1 rotate-45 w-3 h-3 bg-gray-900"></div>
                  The base URL for all API requests. Use this as the prefix for all endpoints.
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="openEditKeyModal('baseUrl')" class="text-gray-500 hover:text-rose-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-rose-50">
                <PencilIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md p-4">
              <div class="font-mono text-sm text-gray-800 overflow-hidden overflow-ellipsis">
                {{ getKeyValue('baseUrl') }}
              </div>
              <div class="flex items-center space-x-2">
                <button @click="copyKey('baseUrl')" class="text-gray-500 hover:text-purple-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-purple-50">
                  <Copy class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Client Credentials Section -->
        <div v-show="activeProvider === 'easyPay'" class="bg-white rounded-xl shadow-sm overflow-hidden card-animation" style="animation-delay: 500ms">
          <div class="bg-gradient-to-r from-rose-50 to-purple-50 px-6 py-4 border-b border-gray-100">
            <h3 class="text-lg font-medium text-gray-900">Client Credentials</h3>
          </div>
          <div class="p-6 space-y-6">
            <!-- Client ID -->
            <div class="credential-item">
              <div class="flex items-center mb-2">
                <h4 class="text-sm font-medium text-gray-700">Client ID</h4>
                <div class="relative ml-2 group">
                  <HelpCircleIcon class="w-4 h-4 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 w-64 bg-gray-900 text-white text-sm rounded-md p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                    <div class="absolute left-0 bottom-[-6px] transform translate-x-1 rotate-45 w-3 h-3 bg-gray-900"></div>
                    Unique identifier for your application. Required for authentication.
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md p-4">
                <div class="font-mono text-sm text-gray-800 overflow-hidden overflow-ellipsis">
                  {{ showKey.clientId ? getKeyValue('clientId') : maskKey(getKeyValue('clientId')) }}
                </div>
                <div class="flex items-center space-x-2">
                  <button @click="toggleKeyVisibility('clientId')" class="text-gray-500 hover:text-rose-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-rose-50">
                    <Eye v-if="!showKey.clientId" class="w-5 h-5" />
                    <EyeOff v-else class="w-5 h-5" />
                  </button>
                  <button @click="copyKey('clientId')" class="text-gray-500 hover:text-purple-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-purple-50">
                    <Copy class="w-5 h-5" />
                  </button>
                  <button @click="openEditKeyModal('clientId')" class="text-gray-500 hover:text-rose-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-rose-50">
                    <PencilIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Client Secret -->
            <div class="credential-item">
              <div class="flex items-center mb-2">
                <h4 class="text-sm font-medium text-gray-700">Client Secret</h4>
                <div class="relative ml-2 group">
                  <HelpCircleIcon class="w-4 h-4 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 w-64 bg-gray-900 text-white text-sm rounded-md p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                    <div class="absolute left-0 bottom-[-6px] transform translate-x-1 rotate-45 w-3 h-3 bg-gray-900"></div>
                    Secret key used to authenticate your application. Keep this secure and never share it.
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md p-4">
                <div class="font-mono text-sm text-gray-800 overflow-hidden overflow-ellipsis">
                  {{ showKey.clientSecret ? getKeyValue('clientSecret') : maskKey(getKeyValue('clientSecret')) }}
                </div>
                <div class="flex items-center space-x-2">
                  <button @click="toggleKeyVisibility('clientSecret')" class="text-gray-500 hover:text-rose-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-rose-50">
                    <Eye v-if="!showKey.clientSecret" class="w-5 h-5" />
                    <EyeOff v-else class="w-5 h-5" />
                  </button>
                  <button @click="copyKey('clientSecret')" class="text-gray-500 hover:text-purple-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-purple-50">
                    <Copy class="w-5 h-5" />
                  </button>
                  <button @click="openEditKeyModal('clientSecret')" class="text-gray-500 hover:text-rose-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-rose-50">
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  <button @click="openRegenerateKeyModal('clientSecret')" class="text-gray-500 hover:text-purple-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-purple-50">
                    <RefreshCw class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Client Code -->
            <div class="credential-item">
              <div class="flex items-center mb-2">
                <h4 class="text-sm font-medium text-gray-700">Client Code</h4>
                <div class="relative ml-2 group">
                  <HelpCircleIcon class="w-4 h-4 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 w-64 bg-gray-900 text-white text-sm rounded-md p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                    <div class="absolute left-0 bottom-[-6px] transform translate-x-1 rotate-45 w-3 h-3 bg-gray-900"></div>
                    Unique code assigned to your client account. Used for transaction identification.
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md p-4">
                <div class="font-mono text-sm text-gray-800 overflow-hidden overflow-ellipsis">
                  {{ showKey.clientCode ? getKeyValue('clientCode') : maskKey(getKeyValue('clientCode')) }}
                </div>
                <div class="flex items-center space-x-2">
                  <button @click="toggleKeyVisibility('clientCode')" class="text-gray-500 hover:text-rose-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-rose-50">
                    <Eye v-if="!showKey.clientCode" class="w-5 h-5" />
                    <EyeOff v-else class="w-5 h-5" />
                  </button>
                  <button @click="copyKey('clientCode')" class="text-gray-500 hover:text-purple-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-purple-50">
                    <Copy class="w-5 h-5" />
                  </button>
                  <button @click="openEditKeyModal('clientCode')" class="text-gray-500 hover:text-rose-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-rose-50">
                    <PencilIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Institution Details Section -->
        <div v-show="activeProvider === 'easyPay'" class="bg-white rounded-xl shadow-sm overflow-hidden card-animation" style="animation-delay: 600ms">
          <div class="bg-gradient-to-r from-rose-50 to-purple-50 px-6 py-4 border-b border-gray-100">
            <h3 class="text-lg font-medium text-gray-900">Institution Details</h3>
          </div>
          <div class="p-6 space-y-6">
            <!-- Institution Code -->
            <div class="credential-item">
              <div class="flex items-center mb-2">
                <h4 class="text-sm font-medium text-gray-700">Institution Code</h4>
                <div class="relative ml-2 group">
                  <HelpCircleIcon class="w-4 h-4 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 w-64 bg-gray-900 text-white text-sm rounded-md p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                    <div class="absolute left-0 bottom-[-6px] transform translate-x-1 rotate-45 w-3 h-3 bg-gray-900"></div>
                    Code that identifies your financial institution in the payment network.
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md p-4">
                <div class="font-mono text-sm text-gray-800 overflow-hidden overflow-ellipsis">
                  {{ getKeyValue('institutionCode') }}
                </div>
                <div class="flex items-center space-x-2">
                  <button @click="copyKey('institutionCode')" class="text-gray-500 hover:text-purple-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-purple-50">
                    <Copy class="w-5 h-5" />
                  </button>
                  <button @click="openEditKeyModal('institutionCode')" class="text-gray-500 hover:text-rose-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-rose-50">
                    <PencilIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Biller ID -->
            <div class="credential-item">
              <div class="flex items-center mb-2">
                <h4 class="text-sm font-medium text-gray-700">Biller ID</h4>
                <div class="relative ml-2 group">
                  <HelpCircleIcon class="w-4 h-4 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 w-64 bg-gray-900 text-white text-sm rounded-md p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                    <div class="absolute left-0 bottom-[-6px] transform translate-x-1 rotate-45 w-3 h-3 bg-gray-900"></div>
                    Unique identifier for your organization as a biller in the payment system.
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md p-4">
                <div class="font-mono text-sm text-gray-800 overflow-hidden overflow-ellipsis">
                  {{ getKeyValue('billerid') }}
                </div>
                <div class="flex items-center space-x-2">
                  <button @click="copyKey('billerid')" class="text-gray-500 hover:text-purple-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-purple-50">
                    <Copy class="w-5 h-5" />
                  </button>
                  <button @click="openEditKeyModal('billerid')" class="text-gray-500 hover:text-rose-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-rose-50">
                    <PencilIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Authorization Code -->
            <div class="credential-item">
              <div class="flex items-center mb-2">
                <h4 class="text-sm font-medium text-gray-700">Authorization Code</h4>
                <div class="relative ml-2 group">
                  <HelpCircleIcon class="w-4 h-4 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 w-64 bg-gray-900 text-white text-sm rounded-md p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                    <div class="absolute left-0 bottom-[-6px] transform translate-x-1 rotate-45 w-3 h-3 bg-gray-900"></div>
                    Code used to authorize transactions. Keep this secure and never share it.
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md p-4">
                <div class="font-mono text-sm text-gray-800 overflow-hidden overflow-ellipsis">
                  {{ showKey.authorizationcode ? getKeyValue('authorizationcode') : maskKey(getKeyValue('authorizationcode')) }}
                </div>
                <div class="flex items-center space-x-2">
                  <button @click="toggleKeyVisibility('authorizationcode')" class="text-gray-500 hover:text-rose-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-rose-50">
                    <Eye v-if="!showKey.authorizationcode" class="w-5 h-5" />
                    <EyeOff v-else class="w-5 h-5" />
                  </button>
                  <button @click="copyKey('authorizationcode')" class="text-gray-500 hover:text-purple-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-purple-50">
                    <Copy class="w-5 h-5" />
                  </button>
                  <button @click="openEditKeyModal('authorizationcode')" class="text-gray-500 hover:text-rose-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-rose-50">
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  <button @click="openRegenerateKeyModal('authorizationcode')" class="text-gray-500 hover:text-purple-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-purple-50">
                    <RefreshCw class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- GL Accounts Section -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden card-animation" style="animation-delay: 700ms">
          <div class="bg-gradient-to-r from-rose-50 to-purple-50 px-6 py-4 border-b border-gray-100">
            <h3 class="text-lg font-medium text-gray-900">GL Accounts</h3>
          </div>
          <div class="p-6 space-y-6">
            <!-- GL Credit -->
            <div class="credential-item">
              <div class="flex items-center mb-2">
                <h4 class="text-sm font-medium text-gray-700">GL Credit</h4>
                <div class="relative ml-2 group">
                  <HelpCircleIcon class="w-4 h-4 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 w-64 bg-gray-900 text-white text-sm rounded-md p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                    <div class="absolute left-0 bottom-[-6px] transform translate-x-1 rotate-45 w-3 h-3 bg-gray-900"></div>
                    General Ledger account for credit transactions. Used for accounting purposes.
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md p-4">
                <div class="font-mono text-sm text-gray-800 overflow-hidden overflow-ellipsis">
                  {{ getKeyValue('glCredit') }}
                </div>
                <div class="flex items-center space-x-2">
                  <button @click="copyKey('glCredit')" class="text-gray-500 hover:text-purple-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-purple-50">
                    <Copy class="w-5 h-5" />
                  </button>
                  <button @click="openEditKeyModal('glCredit')" class="text-gray-500 hover:text-rose-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-rose-50">
                    <PencilIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- GL Debit -->
            <div class="credential-item">
              <div class="flex items-center mb-2">
                <h4 class="text-sm font-medium text-gray-700">GL Debit</h4>
                <div class="relative ml-2 group">
                  <HelpCircleIcon class="w-4 h-4 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 w-64 bg-gray-900 text-white text-sm rounded-md p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                    <div class="absolute left-0 bottom-[-6px] transform translate-x-1 rotate-45 w-3 h-3 bg-gray-900"></div>
                    General Ledger account for debit transactions. Used for accounting purposes.
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md p-4">
                <div class="font-mono text-sm text-gray-800 overflow-hidden overflow-ellipsis">
                  {{ getKeyValue('glDebit') }}
                </div>
                <div class="flex items-center space-x-2">
                  <button @click="copyKey('glDebit')" class="text-gray-500 hover:text-purple-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-purple-50">
                    <Copy class="w-5 h-5" />
                  </button>
                  <button @click="openEditKeyModal('glDebit')" class="text-gray-500 hover:text-rose-600 transition-all duration-200 ease-in-out p-1 rounded-full hover:bg-rose-50">
                    <PencilIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Warning Message -->
        <div class="flex items-start p-4 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl mb-8 card-animation" style="animation-delay: 800ms">
          <AlertTriangleIcon class="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
          <span class="text-amber-800">Never share your secret keys with anyone. Our support team will never ask for your secret keys.</span>
        </div>
      </div>
    </div>

    <!-- Edit Key Modal -->
    <Teleport to="body">
      <div v-if="editKeyModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"></div>
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all modal-animation">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Edit {{ editKeyName }}
            </h3>
            
            <div class="mb-4">
              <label for="keyValue" class="block text-sm font-medium text-gray-700 mb-1">
                {{ activeProvider === 'nip' ? 'NIP' : 'Easy Pay' }} {{ activeEnvironment === 'staging' ? 'Staging' : 'Live' }} {{ editKeyName }}
              </label>
              <input 
                type="text" 
                id="keyValue" 
                v-model="editKeyValue" 
                class="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-gray-800 placeholder-gray-500"
                placeholder="Enter key value"
              />
            </div>
            
            <div class="flex justify-end space-x-3">
              <button 
                @click="closeEditKeyModal" 
                class="px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 ease-in-out"
              >
                Cancel
              </button>
              <button 
                @click="updateKey" 
                class="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-md hover:from-rose-600 hover:to-purple-700 transition-all duration-200 ease-in-out"
                :disabled="!editKeyValue"
                :class="{'opacity-50 cursor-not-allowed': !editKeyValue}"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Regenerate Key Modal -->
    <Teleport to="body">
      <div v-if="regenerateKeyModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"></div>
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all modal-animation">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Regenerate {{ regenerateKeyName }}</h3>
            <p class="text-gray-600 mb-4">
              Are you sure you want to regenerate the {{ activeProvider === 'nip' ? 'NIP' : 'Easy Pay' }} {{ activeEnvironment === 'staging' ? 'Staging' : 'Live' }} {{ regenerateKeyName }}? 
              This action cannot be undone and will invalidate the current key.
            </p>
            
            <div class="flex justify-end space-x-3">
              <button 
                @click="closeRegenerateKeyModal" 
                class="px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 ease-in-out"
              >
                Cancel
              </button>
              <button 
                @click="regenerateKey" 
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200 ease-in-out"
              >
                Regenerate
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Save Changes Modal -->
    <Teleport to="body">
      <div v-if="saveChangesModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"></div>
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all modal-animation">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Save Changes</h3>
            <p class="text-gray-600 mb-4">
              Are you sure you want to save changes to the {{ activeProvider === 'nip' ? 'NIP' : 'Easy Pay' }} {{ activeEnvironment === 'staging' ? 'Staging' : 'Live' }} API keys?
            </p>
            
            <div class="flex justify-end space-x-3">
              <button 
                @click="closeSaveChangesModal" 
                class="px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 ease-in-out"
              >
                Cancel
              </button>
              <button 
                @click="saveChanges" 
                class="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-md hover:from-rose-600 hover:to-purple-700 transition-all duration-200 ease-in-out"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Password Update Modal -->
    <Teleport to="body">
      <div v-if="passwordModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"></div>
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all modal-animation">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Update Password</h3>
            
            <div class="space-y-4">
              <div>
                <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input 
                  type="password" 
                  id="currentPassword" 
                  v-model="passwordForm.currentPassword" 
                  class="w-full px-3 py-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-gray-800 placeholder-gray-500"
                  placeholder="Enter current password"
                />
                <p v-if="passwordErrors.currentPassword" class="mt-1 text-sm text-red-600">
                  {{ passwordErrors.currentPassword }}
                </p>
              </div>
              
              <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input 
                  type="password" 
                  id="newPassword" 
                  v-model="passwordForm.newPassword" 
                  class="w-full px-3 py-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-gray-800 placeholder-gray-500"
                  placeholder="Enter new password"
                />
                <p v-if="passwordErrors.newPassword" class="mt-1 text-sm text-red-600">
                  {{ passwordErrors.newPassword }}
                </p>
              </div>
              
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  v-model="passwordForm.confirmPassword" 
                  class="w-full px-3 py-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-gray-800 placeholder-gray-500"
                  placeholder="Confirm new password"
                />
                <p v-if="passwordErrors.confirmPassword" class="mt-1 text-sm text-red-600">
                  {{ passwordErrors.confirmPassword }}
                </p>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                @click="closePasswordModal" 
                class="px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 ease-in-out"
              >
                Cancel
              </button>
              <button 
                @click="handleUpdatePassword" 
                class="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-md hover:from-rose-600 hover:to-purple-700 transition-all duration-200 ease-in-out flex items-center"
                :disabled="isUpdatingPassword || processing"
                :class="{'opacity-50 cursor-not-allowed': isUpdatingPassword || processing}"
              >
                <LoaderIcon v-if="isUpdatingPassword || processing" class="w-4 h-4 mr-2 animate-spin" />
                <span>Update Password</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Success Toast -->
    <Teleport to="body">
      <div 
        v-if="showToast" 
        class="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center toast-animation"
      >
        <CheckIcon class="w-5 h-5 mr-2" />
        <span>{{ toastMessage }}</span>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useUpdatePassword } from '@/composables/auth/useUpdatePassword';
import { useUpdateCredentials } from '@/composables/auth/useUpdateCredentials'
import { useRouter } from 'vue-router'
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { 
  ServerIcon, 
  CreditCardIcon, 
  HelpCircleIcon,
  Eye, 
  EyeOff, 
  Copy,
  LinkIcon,
  KeyIcon,
  SettingsIcon,
  PencilIcon,
  RefreshCw,
  SaveIcon,
  AlertTriangleIcon,
  CheckIcon,
  LockIcon,
  LoaderIcon,
  BeakerIcon,
  GlobeIcon
} from 'lucide-vue-next'

const router = useRouter()
const { updateCredentials, loading } = useUpdateCredentials()
const { updatePassword, loading: processing } = useUpdatePassword();

interface ApiKey {
  key: string
  value: string
}

interface GroupedApiKeys {
  [provider: string]: {
    [environment: string]: {
      [key: string]: string
    }
  }
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface PasswordErrors {
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

const props = defineProps<{
  apiKeys: ApiKey[]
}>()

// API Provider and Environment
const activeProvider = ref('easyPay')
const activeEnvironment = ref('staging')

// Tab position tracking
const nipTabRef = ref<HTMLElement | null>(null)
const easyPayTabRef = ref<HTMLElement | null>(null)
const stagingTabRef = ref<HTMLElement | null>(null)
const liveTabRef = ref<HTMLElement | null>(null)
const activeProviderPosition = ref(0)
const activeProviderWidth = ref(0)
const activeEnvironmentPosition = ref(0)
const activeEnvironmentWidth = ref(0)

// Grouped API keys
const groupedKeys = ref<GroupedApiKeys>({
  easyPay: {
    staging: {},
    live: {}
  },
  nip: {
    staging: {},
    live: {}
  }
})

// Visibility toggles for sensitive keys
const showKey = ref({
  clientId: false,
  clientSecret: false,
  clientCode: false,
  authorizationcode: false
})

// Modal states
const editKeyModal = ref(false)
const regenerateKeyModal = ref(false)
const saveChangesModal = ref(false)
const passwordModal = ref(false)

// Edit key state
const editKeyName = ref('')
const editKeyValue = ref('')
const regenerateKeyName = ref('')

// Toast notification
const showToast = ref(false)
const toastMessage = ref('')

// Unsaved changes tracking
const hasUnsavedChanges = ref(false)

// Password update
const passwordForm = ref<PasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const passwordErrors = ref<PasswordErrors>({})
const isUpdatingPassword = ref(false)

// Group the API keys on component mount
onMounted(() => {
  console.log('API Keys received:', props.apiKeys)
  if (props.apiKeys && props.apiKeys.length > 0) {
    groupedKeys.value = groupApiKeys(props.apiKeys)
    console.log('Grouped keys:', groupedKeys.value)
  } else {
    console.error('No API keys received or empty array')
    // Initialize with empty structure to prevent undefined errors
    groupedKeys.value = {
      easyPay: {
        staging: {},
        live: {}
      },
      nip: {
        staging: {},
        live: {}
      }
    }
  }
  
  // Initialize tab indicators
  updateTabIndicators()
  
  // Add animation classes to elements
  animateElements()
})

// Function to group API keys by provider and environment
const groupApiKeys = (keys: ApiKey[]): GroupedApiKeys => {
  // Initialize with empty structure to prevent undefined errors
  const grouped: GroupedApiKeys = {
    easyPay: {
      staging: {},
      live: {}
    },
    nip: {
      staging: {},
      live: {}
    }
  }
  
  console.log('Grouping API keys:', keys)
  
  keys.forEach(item => {
    // Parse the key to extract provider, environment, and actual key name
    const keyParts = item.key.split('.')
    
    if (keyParts.length !== 2) {
      console.warn(`Skipping key with unexpected format: ${item.key}`)
      return
    }
    
    const fullProvider = keyParts[0]
    const keyName = keyParts[1]
    
    // Determine provider and environment
    let provider: string
    let environment: string
    
    if (fullProvider === "easypay") {
      provider = "easyPay"
      environment = "live"
    } else if (fullProvider === "easypay-staging") {
      provider = "easyPay"
      environment = "staging"
    } else if (fullProvider === "nip") {
      provider = "nip"
      environment = "live"
    } else if (fullProvider === "nip-staging") {
      provider = "nip"
      environment = "staging"
    } else {
      console.warn(`Skipping key with unknown provider: ${fullProvider}`)
      return // Skip if not matching expected format
    }
    
    // Add the key-value pair
    grouped[provider][environment][keyName] = item.value
  })
  
  // Add lastUpdated field to each environment
  Object.keys(grouped).forEach(provider => {
    Object.keys(grouped[provider]).forEach(env => {
      grouped[provider][env].lastUpdated = new Date().toISOString().split('T')[0]
    })
  })
  
  return grouped
}

// Reset unsaved changes when switching provider or environment
watch([activeProvider, activeEnvironment], () => {
  if (hasUnsavedChanges.value) {
    if (confirm('You have unsaved changes. Do you want to discard them?')) {
      hasUnsavedChanges.value = false
    }
  }
  
  // Update tab indicators after state change
  nextTick(() => {
    updateTabIndicators()
  })
})

// Update tab indicators
const updateTabIndicators = () => {
  nextTick(() => {
    // Provider tabs
    if (activeProvider.value === 'nip' && nipTabRef.value) {
      activeProviderPosition.value = nipTabRef.value.offsetLeft
      activeProviderWidth.value = nipTabRef.value.offsetWidth
    } else if (activeProvider.value === 'easyPay' && easyPayTabRef.value) {
      activeProviderPosition.value = easyPayTabRef.value.offsetLeft
      activeProviderWidth.value = easyPayTabRef.value.offsetWidth
    }
    
    // Environment tabs
    if (activeEnvironment.value === 'staging' && stagingTabRef.value) {
      activeEnvironmentPosition.value = stagingTabRef.value.offsetLeft
      activeEnvironmentWidth.value = stagingTabRef.value.offsetWidth
    } else if (activeEnvironment.value === 'live' && liveTabRef.value) {
      activeEnvironmentPosition.value = liveTabRef.value.offsetLeft
      activeEnvironmentWidth.value = liveTabRef.value.offsetWidth
    }
  })
}

// Add animation to elements
const animateElements = () => {
  // Add staggered animations to elements
  const fadeElements = document.querySelectorAll('.fade-in-up')
  fadeElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('visible')
    }, 100 + index * 100)
  })
  
  const cardElements = document.querySelectorAll('.card-animation')
  cardElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('visible')
    }, 300 + index * 100)
  })
}

// Helper functions
const getKeyValue = (keyName: string): string => {
  // Ensure the provider and environment exist in the grouped keys
  if (!groupedKeys.value[activeProvider.value]) {
    console.warn(`Provider not found: ${activeProvider.value}`)
    return ""
  }
  
  if (!groupedKeys.value[activeProvider.value][activeEnvironment.value]) {
    console.warn(`Environment not found: ${activeEnvironment.value} for provider ${activeProvider.value}`)
    return ""
  }
  
  // Return the key value or an empty string if not found
  return groupedKeys.value[activeProvider.value][activeEnvironment.value][keyName] || ""
}

const getLastUpdated = (): string => {
  if (!groupedKeys.value[activeProvider.value] || 
      !groupedKeys.value[activeProvider.value][activeEnvironment.value] || 
      !groupedKeys.value[activeProvider.value][activeEnvironment.value].lastUpdated) {
    return "N/A"
  }
  
  return groupedKeys.value[activeProvider.value][activeEnvironment.value].lastUpdated
}

const maskKey = (key: string): string => {
  if (!key) return ''
  if (key.length <= 12) return '••••••••••••'
  
  const prefix = key.substring(0, 8)
  const suffix = key.substring(key.length - 4)
  return `${prefix}${'•'.repeat(10)}${suffix}`
}

// Toggle key visibility
const toggleKeyVisibility = (keyName: string): void => {
  showKey.value[keyName as keyof typeof showKey.value] = !showKey.value[keyName as keyof typeof showKey.value]
}

// Copy functions
const copyToClipboard = async (text: string, successMessage: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
    showSuccessToast(successMessage)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const copyKey = async (keyName: string): Promise<void> => {
  const keyValue = getKeyValue(keyName)
  await copyToClipboard(keyValue, `${keyName} copied to clipboard`)
}

// Edit key functions
const openEditKeyModal = (keyName: string): void => {
  editKeyName.value = keyName
  editKeyValue.value = getKeyValue(keyName)
  editKeyModal.value = true
}

const closeEditKeyModal = (): void => {
  editKeyModal.value = false
  editKeyValue.value = ''
}

const updateKey = (): void => {
  // Ensure the provider and environment objects exist
  if (!groupedKeys.value[activeProvider.value]) {
    groupedKeys.value[activeProvider.value] = {}
  }
  
  if (!groupedKeys.value[activeProvider.value][activeEnvironment.value]) {
    groupedKeys.value[activeProvider.value][activeEnvironment.value] = {}
  }
  
  groupedKeys.value[activeProvider.value][activeEnvironment.value][editKeyName.value] = editKeyValue.value
  hasUnsavedChanges.value = true
  closeEditKeyModal()
  showSuccessToast(`${editKeyName.value} updated. Don't forget to save your changes.`)
}

// Regenerate key functions
const openRegenerateKeyModal = (keyName: string): void => {
  regenerateKeyName.value = keyName
  regenerateKeyModal.value = true
}

const closeRegenerateKeyModal = (): void => {
  regenerateKeyModal.value = false
}

const regenerateKey = (): void => {
  // In a real app, this would call an API to regenerate the key
  const prefix = activeProvider.value === 'nip' ? 'nip' : 'ep'
  const env = activeEnvironment.value === 'staging' ? 'staging' : 'live'
  const randomSuffix = Math.random().toString(36).substring(2, 15)
  
  let newKey = ''
  if (regenerateKeyName.value === 'clientSecret') {
    newKey = `${prefix}_${env}_secret_${randomSuffix}`
  } else if (regenerateKeyName.value === 'authorizationcode') {
    newKey = `${prefix}_${env}_auth_${randomSuffix}`
  }
  
  // Ensure the provider and environment objects exist
  if (!groupedKeys.value[activeProvider.value]) {
    groupedKeys.value[activeProvider.value] = {}
  }
  
  if (!groupedKeys.value[activeProvider.value][activeEnvironment.value]) {
    groupedKeys.value[activeProvider.value][activeEnvironment.value] = {}
  }
  
  groupedKeys.value[activeProvider.value][activeEnvironment.value][regenerateKeyName.value] = newKey
  hasUnsavedChanges.value = true
  
  closeRegenerateKeyModal()
  showSuccessToast(`${regenerateKeyName.value} regenerated. Don't forget to save your changes.`)
}

// Save changes functions
const openSaveChangesModal = (): void => {
  if (hasUnsavedChanges.value) {
    saveChangesModal.value = true
  } else {
    showSuccessToast('No changes to save.')
  }
}

const closeSaveChangesModal = (): void => {
  saveChangesModal.value = false
}

const saveChanges = async (): Promise<void> => {
  try {
    // Create an array of updated keys in the format expected by the backend
    const updatedKeys: ApiKey[] = []
    
    // Ensure the provider and environment objects exist
    if (!groupedKeys.value[activeProvider.value]) {
      groupedKeys.value[activeProvider.value] = {}
    }
    
    if (!groupedKeys.value[activeProvider.value][activeEnvironment.value]) {
      groupedKeys.value[activeProvider.value][activeEnvironment.value] = {}
    }
    
    Object.entries(groupedKeys.value[activeProvider.value][activeEnvironment.value]).forEach(([key, value]) => {
      if (key !== 'lastUpdated') {
        const prefix = activeProvider.value === 'easyPay' 
          ? (activeEnvironment.value === 'staging' ? 'easypay-staging' : 'easypay')
          : (activeEnvironment.value === 'staging' ? 'nip-staging' : 'nip')
        
        updatedKeys.push({
          key: `${prefix}.${key}`,
          value: value
        })
      }
    })
    
    await updateCredentials(updatedKeys)
        
    // Update the lastUpdated field
    groupedKeys.value[activeProvider.value][activeEnvironment.value].lastUpdated = new Date().toISOString().split('T')[0]
    
    hasUnsavedChanges.value = false
    closeSaveChangesModal()
    showSuccessToast('Changes saved successfully')
  } catch (error) {
    console.error('Error saving changes:', error)
    showSuccessToast('Failed to save changes', false)
  }
}

// Handle provider change
const handleProviderChange = (provider: string): void => {
  if (hasUnsavedChanges.value) {
    if (confirm('You have unsaved changes. Do you want to discard them?')) {
      activeProvider.value = provider
      hasUnsavedChanges.value = false
    }
  } else {
    activeProvider.value = provider
  }
}

// Handle environment change
const handleEnvironmentChange = (environment: string): void => {
  if (hasUnsavedChanges.value) {
    if (confirm('You have unsaved changes. Do you want to discard them?')) {
      activeEnvironment.value = environment
      hasUnsavedChanges.value = false
    }
  } else {
    activeEnvironment.value = environment
  }
}

// Toast notification
const showSuccessToast = (message: string, success: boolean = true): void => {
  toastMessage.value = message
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Password update functions
const openPasswordModal = (): void => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordErrors.value = {}
  passwordModal.value = true
}

const closePasswordModal = (): void => {
  passwordModal.value = false
}

const validatePasswordForm = (): boolean => {
  let isValid = true
  passwordErrors.value = {}
  
  if (!passwordForm.value.currentPassword) {
    passwordErrors.value.currentPassword = 'Current password is required'
    isValid = false
  }
  
  if (!passwordForm.value.newPassword) {
    passwordErrors.value.newPassword = 'New password is required'
    isValid = false
  } else if (passwordForm.value.newPassword.length < 8) {
    passwordErrors.value.newPassword = 'Password must be at least 8 characters'
    isValid = false
  }
  
  if (!passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Please confirm your new password'
    isValid = false
  } else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  
  return isValid
}

const handleUpdatePassword = async (): Promise<void> => {
  if (!validatePasswordForm()) {
    return
  }
  
  isUpdatingPassword.value = true
  
  try {
    const payloadObj = {
      oldPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    }
    await updatePassword(payloadObj)
    .then((data) => {
      console.log(data, 'data here')
      if(data.type !== 'ERROR'){
        localStorage.clear()
        router.push('/admin')
        closePasswordModal()
      }
    })
  } catch (error) {
    console.error('Error updating password:', error)
    passwordErrors.value.currentPassword = 'Failed to update password. Please try again.'
  } finally {
    isUpdatingPassword.value = false
  }
}
</script>

<style scoped>
/* Animations */
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

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
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

/* Animation classes */
.fade-in-up {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}

.card-animation {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.card-animation.visible {
  opacity: 1;
  transform: translateY(0);
}

.modal-animation {
  animation: scaleIn 0.3s ease-out;
}

.toast-animation {
  animation: slideInRight 0.3s ease-out;
}

.credential-item {
  transition: transform 0.2s ease-out;
}

.credential-item:hover {
  transform: translateY(-2px);
}

/* Tab indicator styling */
.tab-indicator {
  z-index: 0;
}

/* Scale hover effect */
.scale-hover {
  transition: transform 0.2s ease;
}

.scale-hover:hover {
  transform: scale(1.05);
}
</style>