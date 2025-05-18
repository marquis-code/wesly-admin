<template>
    <div>
      <h1 class="text-2xl font-bold mb-6 text-gray-800">My Profile</h1>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Profile Header -->
        <div class="bg-gradient-to-r from-rose-500 to-purple-600 px-6 py-4">
          <div class="flex items-center">
            <div class="relative h-20 w-20 rounded-full border-4 border-white overflow-hidden">
              <img 
                src="@/assets/img/avatar.png" 
                alt="User avatar"
                class="h-full w-full object-cover"
              />
            </div>
            <div class="ml-4 text-white">
              <h2 class="text-xl font-bold">John Doe</h2>
              <p class="text-rose-100">Administrator</p>
            </div>
          </div>
        </div>
        
        <!-- Profile Content -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Personal Information -->
            <div>
              <h3 class="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                  <input 
                    type="text" 
                    v-model="profile.firstName"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    v-model="profile.lastName"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    v-model="profile.email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    v-model="profile.phone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>
            
            <!-- Additional Information -->
            <div>
              <h3 class="text-lg font-medium text-gray-800 mb-4">Additional Information</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Job Title</label>
                  <input 
                    type="text" 
                    v-model="profile.jobTitle"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Department</label>
                  <input 
                    type="text" 
                    v-model="profile.department"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Location</label>
                  <input 
                    type="text" 
                    v-model="profile.location"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Bio</label>
                  <textarea 
                    v-model="profile.bio"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Save Button -->
          <div class="mt-6 flex justify-end">
            <button 
              @click="saveProfile" 
              class="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              :disabled="isSaving"
            >
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  // Profile data
  const profile = ref({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    jobTitle: 'Administrator',
    department: 'IT Department',
    location: 'New York, USA',
    bio: 'Experienced administrator with a passion for technology and streamlining business processes.'
  })
  
  // Save profile state
  const isSaving = ref(false)
  
  // Save profile function
  const saveProfile = async () => {
    try {
      isSaving.value = true
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success notification (you can implement this)
      alert('Profile updated successfully')
    } catch (error) {
      console.error('Failed to update profile:', error)
      // Show error notification (you can implement this)
    } finally {
      isSaving.value = false
    }
  }

  definePageMeta({
      layout: 'admin'
  })
  </script>