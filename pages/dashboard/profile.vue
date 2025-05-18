<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-gray-800">My Profile</h1>
    
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div class="flex items-center space-x-2">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
          <span class="text-gray-600">Loading profile...</span>
        </div>
      </div>

      <!-- Profile Header -->
      <div class="bg-gradient-to-r from-rose-500 to-purple-600 px-6 py-4">
        <div class="flex items-center">
          <div class="relative h-20 w-20 rounded-full border-4 border-white overflow-hidden">
            <!-- <img 
              src="/api/placeholder/80/80" 
              alt="User avatar"
              class="h-full w-full object-cover"
              @error="onImageError"
            /> -->
          </div>
          <div class="ml-4 text-white">
            <h2 class="text-xl font-bold">{{ profileObj?.name || 'Loading...' }}</h2>
            <p class="text-rose-100">{{ profileObj?.role || 'Administrator' }}</p>
          </div>
        </div>
      </div>
      
      <!-- Profile Content -->
      <div class="p-6 relative">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Personal Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>
            <div class="space-y-4">                
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Name</label>
                <input 
                  type="text" 
                  v-model="localProfile.name"
                  :disabled="loading || isSaving"
                  class="w-full px-3 py-2 border disabled border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  v-model="localProfile.username"
                  :disabled="loading || isSaving"
                  class="w-full px-3 py-2 disabled border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

        </div>
        
        <!-- Save Button -->
        <div class="mt-6 flex justify-end">
          <button 
            @click="saveProfile" 
            :disabled="loading || isSaving || !hasChanges"
            class="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <div v-if="isSaving" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
          </button>
        </div>

        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <CheckCircle class="h-5 w-5 text-green-400" />
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-800">{{ successMessage }}</p>
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <XCircle class="h-5 w-5 text-red-400" />
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useFetchProfile } from "@/composables/dashboard/useFetchProfile"
import { CheckCircle, XCircle } from 'lucide-vue-next'

// Composable
const { profileObj, loading } = useFetchProfile()

// Local profile state for editing
const localProfile = ref({
  name: '',
  username: '',
  phone: '',
  role: '',
  department: ''
})

// Original profile data for comparison
const originalProfile = ref({})

// UI state
const isSaving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Watch for profile data changes and sync with local state
watch(profileObj, (newProfile) => {
  if (newProfile) {
    localProfile.value = {
      name: newProfile.name || '',
      username: newProfile.username || '',
      phone: newProfile.phone || '',
      role: newProfile.role || '',
      department: newProfile.department || ''
    }
    originalProfile.value = { ...localProfile.value }
  }
}, { immediate: true })

// Check if there are unsaved changes
const hasChanges = computed(() => {
  return JSON.stringify(localProfile.value) !== JSON.stringify(originalProfile.value)
})

// Clear messages after timeout
const clearMessages = () => {
  setTimeout(() => {
    successMessage.value = ''
    errorMessage.value = ''
  }, 5000)
}

// Handle image loading errors
const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/api/placeholder/80/80' // Fallback image
}

// Save profile function
const saveProfile = async () => {
  if (!hasChanges.value) {
    return
  }

  try {
    isSaving.value = true
    errorMessage.value = ''
    successMessage.value = ''
    
    // Here you would typically call your API to update the profile
    // Example: await $fetch('/api/profile', { method: 'PUT', body: localProfile.value })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update original profile to match current state
    originalProfile.value = { ...localProfile.value }
    
    successMessage.value = 'Profile updated successfully!'
    clearMessages()
    
  } catch (error) {
    console.error('Failed to update profile:', error)
    errorMessage.value = 'Failed to update profile. Please try again.'
    clearMessages()
  } finally {
    isSaving.value = false
  }
}

// Prevent navigation with unsaved changes
onMounted(() => {
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (hasChanges.value && !isSaving.value) {
      event.preventDefault()
      event.returnValue = ''
    }
  }
  
  window.addEventListener('beforeunload', handleBeforeUnload)
  
  // Cleanup on unmount
  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })
})

// Page meta
definePageMeta({
  layout: 'admin'
})
</script>

<style scoped>
/* Custom loader animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Form input focus states */
input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>