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
          <div v-for="(section, sectionIndex) in navigation" :key="sectionIndex" class="mb-6">
            <h3 
              class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider transition-all duration-500"
              :class="isSidebarCollapsed ? 'opacity-0' : 'opacity-100'"
            >
              {{ section.name }}
            </h3>
            
            <div class="space-y-1">
              <NuxtLink 
                v-for="(item, itemIndex) in section.items" 
                :key="item.name"
                :to="item.href"
                :class="[
                  item.current ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 nav-item-animation'
                ]"
                :style="{ animationDelay: `${(sectionIndex * 5 + itemIndex) * 50}ms` }"
              >
                <component 
                  :is="item.icon" 
                  class="flex-shrink-0 w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110"
                  :class="[
                    item.current ? 'text-white' : 'text-gray-400 group-hover:text-rose-500',
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
                
                <!-- Badge -->
                <span 
                  v-if="item.badge && !isSidebarCollapsed" 
                  class="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="[
                    item.current ? 'bg-rose-200 text-rose-800' : 'bg-gray-200 text-gray-800'
                  ]"
                >
                  {{ item.badge }}
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
            
            <!-- Messages -->
            <button class="p-1 text-gray-500 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <MessageSquare class="h-6 w-6" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  Home, 
  BarChart2, 
  FileText, 
  Users, 
  ShoppingBag, 
  ShoppingCart, 
  Receipt, 
  Settings, 
  Shield, 
  Bell, 
  Puzzle, 
  ChevronsLeft, 
  Menu, 
  Search, 
  MessageSquare, 
  LogOut 
} from 'lucide-vue-next'

// Sidebar state
const isSidebarOpen = ref(true)
const isSidebarCollapsed = ref(false)

// Toggle sidebar collapse state (for desktop)
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// Navigation items
const navigation = [
  {
    name: 'Dashboard',
    items: [
      { name: 'Overview', href: '#', icon: Home, current: true },
      { name: 'Analytics', href: '#', icon: BarChart2, current: false, badge: 'New' },
      { name: 'Reports', href: '#', icon: FileText, current: false },
    ]
  },
  {
    name: 'Management',
    items: [
      { name: 'Customers', href: '#', icon: Users, current: false },
      { name: 'Products', href: '#', icon: ShoppingBag, current: false },
      { name: 'Orders', href: '#', icon: ShoppingCart, current: false, badge: '5' },
      { name: 'Invoices', href: '#', icon: Receipt, current: false },
    ]
  },
  {
    name: 'Settings',
    items: [
      { name: 'General', href: '/dashboard/settings', icon: Settings, current: false },
      { name: 'Accounts', href: '/dashboard/accounts', icon: Shield, current: false },
      { name: 'Notifications', href: '#', icon: Bell, current: false },
      { name: 'Integrations', href: '#', icon: Puzzle, current: false },
    ]
  }
]

// Add animation classes when component is mounted
onMounted(() => {
  // Check if we should collapse sidebar on mobile by default
  if (window.innerWidth < 640) {
    isSidebarOpen.value = false
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

/* Scale effect for hover states */
.scale-hover {
  transition: transform 0.2s ease;
}

.scale-hover:hover {
  transform: scale(1.05);
}
</style>