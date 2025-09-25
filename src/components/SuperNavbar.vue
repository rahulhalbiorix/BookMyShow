<template>
  <div class="flex w-full">
    <!-- Sidebar -->
    <aside
      :class="[
        collapsed ? 'w-16' : 'w-64',
        'bg-gray-900 text-white flex flex-col p-6 fixed h-full top-0 left-0 transition-all duration-300',
      ]"
    >
      <button @click="collapsed = !collapsed" class="mb-6 text-gray-400 hover:text-white">
        <i :class="collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"></i>
      </button>

      <!-- User Info -->
      <div
        v-if="!collapsed"
        class="flex flex-col items-center mb-10 p-4 rounded-lg bg-gray-800 shadow-md transition-all duration-300"
      >
        <div
          class="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow"
        >
          {{ store.userName[0] }}
        </div>
        <h2 class="mt-3 text-lg font-semibold">{{ store.userName }}</h2>
        <p class="text-sm text-gray-400 capitalize">{{ store.userRole }}</p>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1">
        <ul class="space-y-3">
          <li>
            <router-link
              :to="{ name: 'SuperAdminDashboard' }"
              :class="[
                collapsed ? 'justify-center' : 'justify-start',
                'flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 transition',
              ]"
              active-class="bg-gray-800 text-blue-400 font-semibold"
            >
              <i class="pi pi-home"></i>
              <span v-if="!collapsed">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'RegisterSubAdmin' }"
              :class="[
                collapsed ? 'justify-center' : 'justify-start',
                'flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 transition',
              ]"
              active-class="bg-gray-800 text-blue-400 font-semibold"
            >
              <i class="pi pi-user-plus"></i>
              <span v-if="!collapsed">Register Sub Admin</span>
            </router-link>
          </li>
          <li>
            <button
              :class="[
                collapsed ? 'justify-center' : 'justify-start',
                'flex items-center gap-3 px-3 py-2 rounded bg-red-600 hover:bg-red-700 transition w-full text-left',
              ]"
              @click="logOutUser"
            >
              <i class="pi pi-sign-out"></i>
              <span v-if="!collapsed">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main
      :class="[
        collapsed ? 'ml-16' : 'ml-64',
        'flex-1 bg-gray-100 px-6 transition-all duration-300',
      ]"
    >
      <router-view></router-view>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { userAuthStore } from '@/stores/userAuthStore'
import { handleLogOut } from '@/Composables/useLogOut'

const { logOutUser } = handleLogOut()

const collapsed = ref(false)

const store = userAuthStore()
</script>

<style scoped>
.hover\:bg-gray-800:hover {
  background-color: #1f2937;
}
.transition {
  transition: all 0.2s ease-in-out;
}
</style>
