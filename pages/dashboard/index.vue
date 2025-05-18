<template>
  <div>
    <!-- Page header -->
    <div class="mb-8 header-animation">
      <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
        Dashboard Overview
      </h1>
      <p class="mt-2 text-gray-600">
        Welcome back, John! Here's what's happening with your business today.
      </p>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div 
        v-for="(stat, index) in formattedStats" 
        :key="stat.key"
        class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 stat-card"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="flex items-center">
          <div class="p-3 rounded-lg" :class="stat.bgColor">
            <component :is="stat.icon" class="h-6 w-6 text-white" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.label }}</dt>
              <dd>
                <div class="text-lg font-semibold text-gray-900">{{ stat.value }}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import { useFetchDashboardStats } from "@/composables/dashboard/useFetchDashboardStats"
import { computed } from 'vue'
import { 
  DollarSign, 
  UserPlus, 
  ShoppingBag, 
  Clock, 
  ShoppingCart, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  PiggyBank,
  FileText,
  CreditCard
} from 'lucide-vue-next'

const { statsObj, loading } = useFetchDashboardStats()

// Define layout
definePageMeta({
  layout: 'admin'
})

// Icon and color mapping for different stat types
const statConfig = {
  totalUploadedAccount: {
    icon: UserPlus,
    label: 'Total Uploaded Accounts',
    bgColor: 'bg-blue-500'
  },
  totalUploadedSavings: {
    icon: PiggyBank,
    label: 'Total Uploaded Savings',
    bgColor: 'bg-green-500'
  },
  successfulAccountProcessed: {
    icon: CheckCircle,
    label: 'Successful Accounts Processed',
    bgColor: 'bg-emerald-500'
  },
  successfulSavingsProcessed: {
    icon: DollarSign,
    label: 'Successful Savings Processed',
    bgColor: 'bg-purple-500'
  },
  // Add more mappings as needed
  totalRevenue: {
    icon: DollarSign,
    label: 'Total Revenue',
    bgColor: 'bg-green-500'
  },
  totalOrders: {
    icon: ShoppingCart,
    label: 'Total Orders',
    bgColor: 'bg-blue-500'
  },
  pendingOrders: {
    icon: Clock,
    label: 'Pending Orders',
    bgColor: 'bg-yellow-500'
  },
  completedTasks: {
    icon: CheckCircle,
    label: 'Completed Tasks',
    bgColor: 'bg-emerald-500'
  }
}

// Fallback configuration for unknown stat keys
const defaultConfig = {
  icon: FileText,
  bgColor: 'bg-gray-500'
}

// Format the stats with icons and labels
const formattedStats = computed(() => {
  if (!statsObj.value) return []
  
  return Object.entries(statsObj.value).map(([key, value]) => {
    const config = statConfig[key as keyof typeof statConfig] || {
      ...defaultConfig,
      label: formatKeyToLabel(key)
    }
    
    return {
      key,
      value,
      ...config
    }
  })
})

// Function to convert camelCase keys to readable labels
function formatKeyToLabel(key: string): string {
  return key
    // Insert space before uppercase letters
    .replace(/([A-Z])/g, ' $1')
    // Capitalize first letter and trim
    .replace(/^./, str => str.toUpperCase())
    .trim()
}
</script>

<style scoped>
/* Animation keyframes */
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
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Animation classes */
.header-animation {
  animation: fadeInUp 0.6s ease-out forwards;
}

.stat-card {
  opacity: 0;
  animation: scaleIn 0.5s ease-out forwards;
}

.chart-card {
  opacity: 0;
  animation: fadeInUp 0.7s ease-out forwards;
}

.chart-animation {
  opacity: 0;
  animation: fadeInRight 0.8s ease-out 0.3s forwards;
}

.activity-card {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.4s forwards;
}

.activity-item {
  opacity: 0;
  animation: fadeInRight 0.6s ease-out forwards;
}
</style>