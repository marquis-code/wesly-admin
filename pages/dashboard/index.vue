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
        v-for="(stat, index) in stats" 
        :key="stat.name"
        class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 stat-card"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="flex items-center">
          <div :class="`p-3 rounded-lg ${stat.bgColor}`">
            <component :is="stat.icon" class="h-6 w-6 text-white" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.name }}</dt>
              <dd>
                <div class="text-lg font-semibold text-gray-900">{{ stat.value }}</div>
                <div class="flex items-center text-sm">
                  <span :class="stat.changeType === 'increase' ? 'text-green-600' : 'text-rose-600'">
                    <TrendingUp v-if="stat.changeType === 'increase'" class="h-4 w-4" />
                    <TrendingDown v-else class="h-4 w-4" />
                  </span>
                  <span :class="stat.changeType === 'increase' ? 'text-green-600' : 'text-rose-600'" class="ml-1">
                    {{ stat.change }}
                  </span>
                  <span class="ml-1 text-gray-500">vs last month</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Sales chart -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 chart-card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Sales Overview</h2>
          <div class="flex space-x-2">
            <button class="px-3 py-1 text-sm bg-rose-100 text-rose-600 rounded-full">Weekly</button>
            <button class="px-3 py-1 text-sm text-gray-600 rounded-full hover:bg-gray-100">Monthly</button>
            <button class="px-3 py-1 text-sm text-gray-600 rounded-full hover:bg-gray-100">Yearly</button>
          </div>
        </div>
        <div class="h-64 chart-animation">
          <!-- Chart placeholder -->
          <div class="w-full h-full bg-gradient-to-r from-rose-50 to-purple-50 rounded-lg flex items-center justify-center">
            <p class="text-gray-500">Sales chart visualization would appear here</p>
          </div>
        </div>
      </div>

      <!-- Customers chart -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 chart-card" style="animation-delay: 200ms">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Customer Growth</h2>
          <div class="flex space-x-2">
            <button class="px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded-full">Weekly</button>
            <button class="px-3 py-1 text-sm text-gray-600 rounded-full hover:bg-gray-100">Monthly</button>
            <button class="px-3 py-1 text-sm text-gray-600 rounded-full hover:bg-gray-100">Yearly</button>
          </div>
        </div>
        <div class="h-64 chart-animation">
          <!-- Chart placeholder -->
          <div class="w-full h-full bg-gradient-to-r from-purple-50 to-rose-50 rounded-lg flex items-center justify-center">
            <p class="text-gray-500">Customer growth chart would appear here</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent activity -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 activity-card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <button class="text-sm text-rose-600 hover:text-rose-800 transition-colors duration-200">View all</button>
      </div>
      
      <div class="space-y-6">
        <div 
          v-for="(activity, index) in activities" 
          :key="index" 
          class="flex activity-item"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div :class="`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${activity.iconBg}`">
            <component :is="activity.icon" class="h-5 w-5 text-white" />
          </div>
          <div class="ml-4 flex-1">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">{{ activity.time }}</p>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import { 
  DollarSign, 
  UserPlus, 
  ShoppingBag, 
  Clock, 
  ShoppingCart, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-vue-next'

// Stats data
const stats = [
  {
    name: 'Total Revenue',
    value: '$45,231',
    change: '12%',
    changeType: 'increase',
    bgColor: 'bg-gradient-to-r from-rose-500 to-rose-600',
    icon: DollarSign
  },
  {
    name: 'New Customers',
    value: '2,845',
    change: '5.3%',
    changeType: 'increase',
    bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
    icon: UserPlus
  },
  {
    name: 'Active Products',
    value: '1,249',
    change: '2.1%',
    changeType: 'decrease',
    bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
    icon: ShoppingBag
  },
  {
    name: 'Pending Orders',
    value: '42',
    change: '8.4%',
    changeType: 'increase',
    bgColor: 'bg-gradient-to-r from-amber-500 to-amber-600',
    icon: Clock
  }
]

// Recent activities
const activities = [
  {
    title: 'New order placed',
    description: 'John Doe placed a new order for Premium Package',
    time: '2 minutes ago',
    icon: ShoppingCart,
    iconBg: 'bg-gradient-to-r from-rose-500 to-rose-600'
  },
  {
    title: 'New customer registered',
    description: 'Jane Smith created a new account',
    time: '45 minutes ago',
    icon: UserPlus,
    iconBg: 'bg-gradient-to-r from-purple-500 to-purple-600'
  },
  {
    title: 'Payment received',
    description: 'Payment of $1,250 received from ABC Corp',
    time: '2 hours ago',
    icon: DollarSign,
    iconBg: 'bg-gradient-to-r from-green-500 to-green-600'
  },
  {
    title: 'Product updated',
    description: 'Product "Wireless Headphones" was updated',
    time: '5 hours ago',
    icon: RefreshCw,
    iconBg: 'bg-gradient-to-r from-blue-500 to-blue-600'
  }
]

// Define layout
definePageMeta({
  layout: 'admin'
})
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