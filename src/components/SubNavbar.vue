<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white flex flex-col p-6">
      <!-- User Info -->
      <div class="flex flex-col items-center mb-10">
        <div
          class="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold"
        >
          Sub -Admin Side
        </div>
        <h2 class="mt-3 text-lg font-semibold">Sub -Admin Side</h2>
        <p class="text-sm text-gray-400">Sub -Admin Side</p>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1">
        <ul class="space-y-3">
          <li v-for="(link, index) in navLinks" :key="index">
            <a :href="link.href" class="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
              {{ link.label }}
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 bg-gray-100 p-6">
      <h1 class="text-2xl font-bold">Main Content Area</h1>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const navLinks = ref([
  { label: 'Dashboard', href: '#' },

  { label: 'Logout', href: '#' },
])
</script>
