<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50">
    <!-- Sidebar -->
    <div 
      class="fixed inset-y-0 left-0 z-50 bg-white shadow-xl"
      :class="[isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0', 
              isSidebarCollapsed ? 'w-20' : 'w-64']"
    >
      <div class="flex flex-col h-full overflow-hidden ">
        <!-- Logo section -->
        <div class="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <div class="flex items-center space-x-2">
            <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-rose-500 to-purple-600">
              <span class="text-white font-bold text-xl">A</span>
            </div>
            <h1 
              class="text-xl font-bold text-gray-800"
              :class="isSidebarCollapsed ? 'hidden' : 'block'"
            >
              Admin
            </h1>
          </div>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <div class="mb-6">
            <div class="space-y-1">
              <NuxtLink 
                v-for="item in navigation" 
                :key="item.name"
                :to="item.href"
                :class="[
                  isActive(item.href) ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
                ]"
              >
                <component 
                  :is="item.icon" 
                  class="flex-shrink-0 w-6 h-6"
                  :class="[
                    isActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-rose-500',
                    isSidebarCollapsed ? 'mx-auto' : 'mr-3'
                  ]"
                  aria-hidden="true" 
                />
                <span 
                  :class="isSidebarCollapsed ? 'hidden' : 'block'"
                >
                  {{ item.name }}
                </span>
              </NuxtLink>
            </div>
          </div>
        </nav>
        
        <!-- User profile -->
        <div class="flex items-center p-4 border-t border-gray-100">
          <div class="relative flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
            <!-- <img 
              src="@/assets/img/avatar.png" 
              alt="User avatar"
              class="absolute inset-0 w-full h-full object-cover"
            /> -->
            <div class="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-purple-600/20"></div>
          </div>
          <div 
            class="ml-3"
            :class="isSidebarCollapsed ? 'hidden' : 'block'"
          >
            <p class="text-sm font-medium text-gray-800">{{profileObj?.name ?? 'Nil'}} </p>
            <p class="text-xs text-gray-500">{{profileObj?.username ?? 'Nil'}}</p>
          </div>
          <button 
            @click="showLogoutModal = true"
            class="ml-auto p-1 rounded-full text-gray-400 hover:text-gray-600"
            :class="isSidebarCollapsed ? 'hidden' : 'block'"
          >
            <LogOut class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile sidebar backdrop -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 z-10 bg-gray-600 bg-opacity-75 sm:hidden"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Main content -->
    <div 
      :class="[
        isSidebarCollapsed ? 'sm:ml-20' : 'sm:ml-64'
      ]"
    >
      <!-- Top navigation -->
      <header class="sticky top-0 z-10 bg-white shadow-sm">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div class="flex items-center flex-1">
            <button 
              @click="isSidebarOpen = !isSidebarOpen" 
              class="sm:hidden -ml-1 p-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none"
            >
              <Menu class="h-6 w-6" />
            </button>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Settings Dropdown -->
            <div class="relative settings-dropdown">
              <button 
                @click.stop="isSettingsOpen = !isSettingsOpen" 
                class="p-1 text-gray-500 rounded-full hover:bg-gray-100"
              >
                <Settings class="h-6 w-6" />
              </button>
              
              <!-- Settings Dropdown Menu -->
              <div 
                v-show="isSettingsOpen" 
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200"
              >
                <div 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  @click="navigateTo('/dashboard/profile'); isSettingsOpen = false;"
                >
                  Profile
                </div>
                <div 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  @click="openPasswordModal(); isSettingsOpen = false;"
                >
                  Update Password
                </div>
                <div 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  @click="showLogoutModal = true; isSettingsOpen = false;"
                >
                  Logout
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <div>
          <slot />
        </div>
      </main>
    </div>

    <!-- Logout Confirmation Modal -->
    <div 
      v-if="showLogoutModal" 
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <!-- Modal backdrop with blur -->
      <div 
        class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" 
        aria-hidden="true"
        @click="showLogoutModal = false"
      ></div>

      <div class="flex items-center justify-center min-h-screen p-4">
        <!-- Modal panel -->
        <div 
          class="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
          @click.stop
        >
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <LogOut class="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Logout Confirmation
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to log out of your account? You will need to log in again to access your dashboard.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-base font-medium text-white hover:from-rose-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="logout"
            >
              Logout
            </button>
            <button 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:mt-0 sm:w-auto sm:text-sm"
              @click="showLogoutModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Password Update Modal -->
    <div 
      v-if="showPasswordModal" 
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <!-- Modal backdrop with blur -->
      <div 
        class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" 
        aria-hidden="true"
        @click="showPasswordModal = false"
      ></div>

      <div class="flex items-center justify-center min-h-screen p-4">
        <!-- Modal panel -->
        <div 
          class="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
          @click.stop
        >
          <button
            type="button"
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-500 focus:outline-none"
            @click="showPasswordModal = false"
          >
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <Lock class="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Update Password
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Please enter your current password and a new password to update your credentials.
                </p>
              </div>
            </div>
          </div>
          
          <div class="mt-5">
            <form @submit.prevent="handleUpdatePassword">
              <!-- Current Password -->
              <div class="mb-4">
                <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
                <div class="mt-1 relative">
                  <input
                    :type="showCurrentPassword ? 'text' : 'password'"
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    class="shadow-sm focus:ring-rose-500 border-[0.5px] outline-none p-3 focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                  <button 
                    type="button" 
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  >
                    <Eye v-if="!showCurrentPassword" class="h-5 w-5" />
                    <EyeOff v-else class="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <!-- New Password -->
              <div class="mb-4">
                <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
                <div class="mt-1 relative">
                  <input
                    :type="showNewPassword ? 'text' : 'password'"
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    class="shadow-sm focus:ring-rose-500 border-[0.5px] outline-none p-3 focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                  <button 
                    type="button" 
                    @click="showNewPassword = !showNewPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  >
                    <Eye v-if="!showNewPassword" class="h-5 w-5" />
                    <EyeOff v-else class="h-5 w-5" />
                  </button>
                </div>
                <p v-if="passwordErrors.sameAsOld" class="mt-1 text-sm text-red-600">
                  New password cannot be the same as your current password
                </p>
              </div>
              
              <!-- Confirm Password -->
              <div class="mb-4">
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div class="mt-1 relative">
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    class="shadow-sm focus:ring-rose-500 border-[0.5px] outline-none p-3 focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                  <button 
                    type="button" 
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  >
                    <Eye v-if="!showConfirmPassword" class="h-5 w-5" />
                    <EyeOff v-else class="h-5 w-5" />
                  </button>
                </div>
                <p v-if="passwordErrors.mismatch" class="mt-1 text-sm text-red-600">
                  Passwords do not match
                </p>
              </div>
              
              <div class="sm:flex sm:flex-row-reverse">
                <button 
                  type="submit" 
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-base font-medium text-white hover:from-rose-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:ml-3 sm:w-auto sm:text-sm"
                  :disabled="!isPasswordFormValid"
                >
                {{ processing ? 'Updating...' : 'Update Password' }}
                </button>
                <button 
                  type="button" 
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:mt-0 sm:w-auto sm:text-sm"
                  @click="showPasswordModal = false"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUpdatePassword } from '@/composables/auth/useUpdatePassword';
import { useFetchProfile } from "@/composables/dashboard/useFetchProfile"
const { profileObj, loading } = useFetchProfile()
const { updatePassword, loading: processing } = useUpdatePassword();
import { 
  Settings, 
  User, 
  Menu, 
  LogOut,
  Lock,
  Eye,
  EyeOff,
  FileText,
  Key,
  Home
} from 'lucide-vue-next'

// Sidebar state
const isSidebarOpen = ref(true)
const isSidebarCollapsed = ref(false)
const showLogoutModal = ref(false)
const showPasswordModal = ref(false)
const isSettingsOpen = ref(false)

  // Submission state
  // const isSubmitting = ref(false)

// Password form state
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Password visibility toggles
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Password validation errors
const passwordErrors = ref({
  sameAsOld: false,
  mismatch: false
})

// Get router
const router = useRouter()

// Check if an item is active
const isActive = (path: string) => {
  return router.currentRoute.value.path === path
}

// Logout function
const logout = () => {
  // Clear all localStorage items
  localStorage.clear()
  
  // Redirect to home page
  router.push('/')
  
  // Close the modal
  showLogoutModal.value = false
}

// Navigation items - updated as requested
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Accounts', href: '/dashboard/accounts', icon: FileText },
  { name: 'Saving Details', href: '/dashboard/account-details', icon: FileText },
  { name: 'API Keys', href: '/dashboard/settings', icon: FileText },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Update Password', href: '/dashboard/update-password', icon: Key }
]

// Navigate to a path
const navigateTo = (path: string) => {
  router.push(path)
}

// Open password modal (only from dropdown)
const openPasswordModal = () => {
  showPasswordModal.value = true
}

// Validate password form
const validatePasswordForm = () => {
  // Check if new password is same as old
  passwordErrors.value.sameAsOld = 
    passwordForm.value.currentPassword === passwordForm.value.newPassword && 
    passwordForm.value.currentPassword !== ''
  
  // Check if passwords match
  passwordErrors.value.mismatch = 
    passwordForm.value.newPassword !== passwordForm.value.confirmPassword &&
    passwordForm.value.confirmPassword !== ''
}

// Watch for changes in the password form
const isPasswordFormValid = computed(() => {
  validatePasswordForm()
  
  return (
    passwordForm.value.currentPassword !== '' &&
    passwordForm.value.newPassword !== '' &&
    passwordForm.value.confirmPassword !== '' &&
    !passwordErrors.value.sameAsOld &&
    !passwordErrors.value.mismatch
  )
})

// Update password function
const handleUpdatePassword = async () => {
  if (!isPasswordFormValid.value) return
  
  // // Here you would typically call an API to update the password
  // console.log('Password updated successfully')

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
        router.push('/dashboard')
      }
    })
  } catch (error) {
    console.error('Error updating password:', error)
      // Reset form and close modal
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  showPasswordModal.value = false
  } 
  finally {
     // Reset form and close modal
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  showPasswordModal.value = false
  }
  
}

// Close settings dropdown when clicking outside
const closeSettingsDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (isSettingsOpen.value && !target.closest('.settings-dropdown')) {
    isSettingsOpen.value = false
  }
}

// Add event listener for clicks outside settings dropdown
onMounted(() => {
  // Check if we should collapse sidebar on mobile by default
  if (window.innerWidth < 640) {
    isSidebarOpen.value = false
  }
  
  // Add click event listener for closing settings dropdown
  document.addEventListener('click', closeSettingsDropdown)
})

// Clean up event listeners
onBeforeUnmount(() => {
  document.removeEventListener('click', closeSettingsDropdown)
})

</script>

<style scoped>
/* Base styles only - removed animations */
.router-link-active,
.router-link-exact-active {
  @apply bg-gradient-to-r from-rose-500 to-purple-600 text-white;
}

.router-link-active svg,
.router-link-exact-active svg {
  @apply text-white;
}
</style>