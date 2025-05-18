<template>
    <div>
      <h1 class="text-2xl font-bold mb-6 text-gray-800">Update Password</h1>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl">
        <div class="p-6">
          <div class="flex items-start mb-6">
            <div class="flex-shrink-0">
              <Lock class="h-8 w-8 text-rose-500" />
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-medium text-gray-800">Change Your Password</h2>
              <p class="text-sm text-gray-500">
                Ensure your account is using a strong, secure password to protect your information.
              </p>
            </div>
          </div>
          
          <form @submit.prevent="handleUpdatePassword">
            <!-- Current Password -->
            <div class="mb-4">
              <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
              <div class="mt-1 relative">
                <input
                  :type="showCurrentPassword ? 'text' : 'password'"
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  class="shadow-sm focus:ring-rose-500 border-[0.5px] p-3 outline-none focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                  class="shadow-sm focus:ring-rose-500 border-[0.5px] p-3 outline-none focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
              <div class="mt-1">
                <p class="text-xs text-gray-500">Password should be at least 8 characters and include a mix of letters, numbers, and symbols.</p>
              </div>
            </div>
            
            <!-- Confirm Password -->
            <div class="mb-6">
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div class="mt-1 relative">
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  class="shadow-sm focus:ring-rose-500 border-[0.5px] p-3 outline-none focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
            
            <div class="flex justify-end">
              <button 
                type="submit" 
                class="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                :disabled="!isPasswordFormValid || isSubmitting"
              >
                {{ isSubmitting ? 'Updating...' : 'Update Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Lock, Eye, EyeOff } from 'lucide-vue-next'
  import { useUpdatePassword } from '@/composables/auth/useUpdatePassword';
  const { updatePassword, loading: processing } = useUpdatePassword();
  const router = useRouter()
  
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
  
  // Submission state
  const isSubmitting = ref(false)
  
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
  } finally {
    isSubmitting.value = false
  }
  }


  definePageMeta({
      layout: 'admin'
  })
  </script>