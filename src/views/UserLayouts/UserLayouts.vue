<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <nav class="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <h1 class="text-xl font-bold">BookMyShow</h1>

      <ul class="flex gap-6">
        <li>
          <RouterLink
            :to="{ name: 'MovieList' }"
            class="hover:text-yellow-400"
            active-class="text-yellow-400"
          >
            Movies
          </RouterLink>
        </li>

        <li>
          <RouterLink
            :to="{ name: 'UserBookings' }"
            class="hover:text-yellow-400"
            active-class="text-yellow-400"
          >
            Bookings
          </RouterLink>
        </li>
        <li>
          <Button severity="danger" label="logOut" @click="store.logOut"></Button>
        </li>
      </ul>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 p-6 bg-gray-100">
      <!-- Render children -->
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue'
import { RouterLink, RouterView } from 'vue-router'
import { userAuthStore } from '@/stores/userAuthStore'

const store = userAuthStore()
</script>
