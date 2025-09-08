<template>
  <nav class="flex items-center justify-between bg-gray-900 text-white px-6 h-16 shadow-md">
    <!-- Left: Logo -->
    <div class="text-2xl font-bold cursor-pointer">BookMyShow</div>

    <!-- Middle: Search Bar -->
    <div class="flex-1 flex justify-center px-4">
      <input
        type="text"
        placeholder="Search movies..."
        class="w-1/2 px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>

    <!-- Right: Buttons -->
    <div class="flex items-center gap-4 relative">
      <!-- Sign In Button -->
      <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm">
        Sign In
      </button>

      <!-- User Profile -->
      <div class="flex items-center space-x-1 cursor-pointer">
        <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <i class="pi pi-user text-lg"></i>
        </div>
        <span>rahul</span>
      </div>

      <!-- Dropdown Menu -->
      <div class="relative">
        <button class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md" @click="toggleDropdown">
          <i class="pi pi-bars"></i>
        </button>

        <div
          v-if="showDropdown"
          class="absolute right-0 top-12 w-40 bg-white text-black rounded-md shadow-lg z-1"
        >
          <ul class="py-2">
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Home</li>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Movies</li>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Bookings</li>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}
</script>
