<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <nav class="bg-gray-900 text-white shadow-md">
      <div class="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <!-- Logo -->
        <h1 class="text-2xl font-bold tracking-wide">BookMyShow</h1>

        <!-- Nav Links -->
        <ul class="flex items-center gap-8">
          <li>
            <RouterLink
              :to="{ name: 'MovieList' }"
              class="hover:text-yellow-400 transition"
              active-class="text-yellow-400 font-semibold"
            >
              Movies
            </RouterLink>
          </li>

          <li>
            <RouterLink
              :to="{ name: 'UserBookings' }"
              class="hover:text-yellow-400 transition"
              active-class="text-yellow-400 font-semibold"
            >
              Bookings
            </RouterLink>
          </li>

          <!-- Logout button -->
          <li>
            <Button
              severity="danger"
              label="Logout"
              class="!bg-red-600 hover:!bg-red-700 !text-white rounded-lg px-4 py-2"
              @click="logOutUser"
            />
          </li>
        </ul>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 p-6 bg-gray-100">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue'
import { RouterLink, RouterView } from 'vue-router'
import { userAuthStore } from '@/stores/userAuthStore'
import { handleLogOut } from '@/Composables/useLogOut'

const { logOutUser } = handleLogOut()

const store = userAuthStore()
</script>
