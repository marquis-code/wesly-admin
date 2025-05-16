<template>
  <section>
    <div v-if="!loading">
      <ApiKeysManagement :apiKeys="credentials" />
    </div>
    <div v-else class="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 py-8 px-4">
      <!-- Loading skeleton with beautiful animation -->
      <div class="max-w-7xl mx-auto">
        <!-- Header skeleton -->
        <div class="text-center mb-8 animate-pulse">
          <div class="h-10 w-64 bg-white/70 rounded-lg mx-auto mb-3"></div>
          <div class="h-5 w-96 bg-white/70 rounded-lg mx-auto"></div>
        </div>
        
        <!-- Provider tabs skeleton -->
        <div class="flex justify-center mb-8">
          <div class="bg-white/70 rounded-full h-12 w-64 animate-pulse"></div>
        </div>
        
        <!-- Environment tabs skeleton -->
        <div class="flex justify-center mb-8">
          <div class="bg-white/70 rounded-full h-12 w-64 animate-pulse"></div>
        </div>
        
        <!-- Quick actions skeleton -->
        <div class="flex justify-center gap-3 mb-8 flex-wrap">
          <div class="h-10 w-32 bg-white/70 rounded-full animate-pulse"></div>
          <div class="h-10 w-32 bg-white/70 rounded-full animate-pulse"></div>
          <div class="h-10 w-32 bg-white/70 rounded-full animate-pulse"></div>
        </div>
        
        <!-- Cards skeleton -->
        <div class="space-y-6">
          <div class="bg-white/70 rounded-xl h-40 animate-pulse"></div>
          <div class="bg-white/70 rounded-xl h-80 animate-pulse"></div>
          <div class="bg-white/70 rounded-xl h-80 animate-pulse"></div>
          <div class="bg-white/70 rounded-xl h-60 animate-pulse"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useGetCredentials } from '@/composables/auth/useGetCredentials';
import { useHead } from '#app';

const { credentials, loading } = useGetCredentials();

// Use head to set page title and meta
useHead({
  title: 'API Keys Management | Fintech Dashboard',
  meta: [
    { name: 'description', content: 'Manage your NIP and Easy Pay API keys for both staging and live environments.' },
    { name: 'keywords', content: 'API keys, NIP, Easy Pay, fintech, payment gateway, API management' }
  ]
})

definePageMeta({
  title: 'API Keys Management',
  layout: 'admin'
})
</script>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.5) 8%,
    rgba(255, 255, 255, 0.8) 18%,
    rgba(255, 255, 255, 0.5) 33%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>