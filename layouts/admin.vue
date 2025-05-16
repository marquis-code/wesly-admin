<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50">
    <!-- Sidebar with animation -->
    <div 
      class="fixed inset-y-0 left-0 z-20 transition-all duration-500 ease-in-out transform"
      :class="[isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0', 
              isSidebarCollapsed ? 'w-20' : 'w-64']"
    >
      <div class="flex flex-col h-full bg-white shadow-xl overflow-hidden">
        <!-- Logo section -->
        <div class="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <div class="flex items-center space-x-2">
            <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-rose-500 to-purple-600 logo-animation">
              <span class="text-white font-bold text-xl">A</span>
            </div>
            <h1 
              class="text-xl font-bold text-gray-800 transition-all duration-500 origin-left"
              :class="isSidebarCollapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'"
            >
              Admin
            </h1>
          </div>
          <button 
            @click="toggleSidebar" 
            class="hidden sm:flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronsLeft 
              class="h-5 w-5 transition-transform duration-300" 
              :class="isSidebarCollapsed ? 'rotate-180' : ''"
            />
          </button>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <div class="mb-6">
            <div class="space-y-1">
              <NuxtLink 
                v-for="(item, index) in navigation" 
                :key="item.name"
                :to="item.href"
                :class="[
                  isActive(item.href) ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 nav-item-animation'
                ]"
                :style="{ animationDelay: `${index * 50}ms` }"
                @click="setActiveItem(item.href)"
              >
                <component 
                  :is="item.icon" 
                  class="flex-shrink-0 w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110"
                  :class="[
                    isActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-rose-500',
                    isSidebarCollapsed ? 'mx-auto' : ''
                  ]"
                  aria-hidden="true" 
                />
                <span 
                  class="truncate transition-all duration-500 origin-left"
                  :class="isSidebarCollapsed ? 'opacity-0 scale-0 w-0' : 'opacity-100 scale-100'"
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
            <img 
              src="@/assets/img/avatar.png" 
              alt="User avatar"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-purple-600/20"></div>
          </div>
          <div 
            class="ml-3 transition-all duration-500 origin-left"
            :class="isSidebarCollapsed ? 'opacity-0 scale-0 w-0' : 'opacity-100 scale-100'"
          >
            <p class="text-sm font-medium text-gray-800">John Doe</p>
            <p class="text-xs text-gray-500">Administrator</p>
          </div>
          <button 
            @click="showLogoutModal = true"
            class="ml-auto p-1 rounded-full text-gray-400 hover:text-gray-600 transition-colors duration-200"
            :class="isSidebarCollapsed ? 'opacity-0 scale-0 w-0' : 'opacity-100 scale-100'"
          >
            <LogOut class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile sidebar backdrop -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 z-10 bg-gray-600 bg-opacity-75 sm:hidden transition-opacity duration-300 ease-in-out"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Main content -->
    <div 
      class="transition-all duration-500 ease-in-out"
      :class="[
        isSidebarOpen ? 'sm:ml-64' : 'sm:ml-20',
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
            <div class="ml-2 sm:ml-0 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search class="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="relative p-1 text-gray-500 rounded-full hover:bg-gray-100 transition-colors duration-200 notification-bell">
              <Bell class="h-6 w-6" />
              <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>
            
            <!-- Settings -->
            <button class="p-1 text-gray-500 rounded-full hover:bg-gray-100 transition-colors duration-200 settings-icon">
              <Settings class="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div class="page-transition">
          <slot />
        </div>
      </main>
    </div>

    <!-- Logout Confirmation Modal -->
    <Teleport to="body">
      <div 
        v-if="showLogoutModal" 
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title" 
        role="dialog" 
        aria-modal="true"
      >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Modal backdrop -->
          <div 
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity modal-backdrop" 
            aria-hidden="true"
            @click="showLogoutModal = false"
          ></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <!-- Modal panel -->
          <div 
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 modal-content"
          >
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 modal-icon-animation">
                <LogOut class="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left modal-text-animation">
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
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse modal-buttons-animation">
              <button 
                type="button" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-base font-medium text-white hover:from-rose-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                @click="logout"
              >
                Logout
              </button>
              <button 
                type="button" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:mt-0 sm:w-auto sm:text-sm transition-all duration-200"
                @click="showLogoutModal = false"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Settings, 
  Shield, 
  Bell, 
  ChevronsLeft, 
  Menu, 
  Search, 
  LogOut 
} from 'lucide-vue-next'

// Sidebar state
const isSidebarOpen = ref(true)
const isSidebarCollapsed = ref(false)
const activeItem = ref('/dashboard/settings') // Default active item
const showLogoutModal = ref(false)

// Get current route and router
const route = useRoute()
const router = useRouter()

// Toggle sidebar collapse state (for desktop)
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// Set active item
const setActiveItem = (path: string) => {
  activeItem.value = path
  // Store in localStorage for persistence across page refreshes
  localStorage.setItem('activeNavItem', path)
}

// Check if an item is active
const isActive = (path: string) => {
  // First check if the path matches the current route
  if (route && route.path === path) {
    return true
  }
  // Otherwise use our stored active item
  return activeItem.value === path
}

// Logout function
const logout = () => {
  // Add a small delay for the animation to complete
  setTimeout(() => {
    // Clear all localStorage items
    localStorage.clear()
    
    // Redirect to home page
    router.push('/')
    
    // Close the modal
    showLogoutModal.value = false
  }, 300)
}

// Navigation items - simplified to only include Accounts and Settings
const navigation = [
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Accounts', href: '/dashboard/accounts', icon: Shield }
]

// Add animation classes when component is mounted
onMounted(() => {
  // Check if we should collapse sidebar on mobile by default
  if (window.innerWidth < 640) {
    isSidebarOpen.value = false
  }
  
  // Restore active item from localStorage if available
  const savedActiveItem = localStorage.getItem('activeNavItem')
  if (savedActiveItem) {
    activeItem.value = savedActiveItem
  } else if (route && route.path) {
    // If no saved item but we have a route, use that
    activeItem.value = route.path
  }
  
  // Add animation to navigation items
  const navItems = document.querySelectorAll('.nav-item-animation')
  navItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('nav-item-visible')
    }, 100 + index * 50)
  })
})
</script>

<style scoped>
/* Animation keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-2px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(2px);
  }
}

/* Animation classes */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.page-transition {
  animation: slideInUp 0.5s ease-out forwards;
}

.nav-item-animation {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.nav-item-visible {
  opacity: 1;
  transform: translateX(0);
}

.logo-animation {
  animation: pulse 3s infinite;
}

.notification-bell:hover svg {
  animation: bounce 0.5s ease-in-out;
}

.settings-icon:hover svg {
  animation: spin 1s ease-in-out;
}

/* Modal animations */
.modal-backdrop {
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  animation: slideInUp 0.4s ease-out;
}

.modal-icon-animation {
  animation: pulse 1s ease-in-out;
}

.modal-text-animation {
  animation: slideInRight 0.5s ease-out;
}

.modal-buttons-animation {
  animation: fadeIn 0.6s ease-out;
}

.modal-buttons-animation button:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

.modal-buttons-animation button:first-child:hover {
  animation: pulse 1s infinite;
}

.modal-buttons-animation button:last-child:hover {
  animation: shake 0.5s;
}

/* Scale effect for hover states */
.scale-hover {
  transition: transform 0.2s ease;
}

.scale-hover:hover {
  transform: scale(1.05);
}

/* Fix for active link styles */
.router-link-active,
.router-link-exact-active {
  @apply bg-gradient-to-r from-rose-500 to-purple-600 text-white;
}

.router-link-active svg,
.router-link-exact-active svg {
  @apply text-white;
}
</style>