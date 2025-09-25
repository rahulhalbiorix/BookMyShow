<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Super Admin Dashboard</h1>

    <div class="flex justify-between items-center mb-6">
      <div class="relative">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
          v-model="search"
          type="text"
          placeholder="Search SubAdmins..."
          class="pl-10 pr-4 py-2 border rounded-lg w-72 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow"
        @click="() => router.push({ name: 'RegisterSubAdmin' })"
      >
        <i class="pi pi-user-plus"></i> Add Sub Admin
      </button>
    </div>

    <div v-if="loading" class="text-center py-10 text-gray-600">
      <i class="pi pi-spin pi-spinner text-3xl mb-3"></i>
      <p>Loading Sub Admins...</p>
    </div>

    <div v-else class="overflow-x-auto bg-white shadow-md">
      <table class="min-w-full border border-gray-200">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="px-6 py-3 text-left">#</th>
            <th class="px-6 py-3 text-left">Image</th>
            <th class="px-6 py-3 text-left">Name</th>
            <th class="px-6 py-3 text-left">Email</th>
            <th class="px-6 py-3 text-left">Mobile</th>
            <th class="px-6 py-3 text-left">Role</th>
            <th class="px-6 py-3 text-left">Status</th>
            <th class="px-6 py-3 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(admin, index) in filteredAdmins"
            :key="admin._id"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-6 py-3 border">{{ index + 1 }}</td>
            <td class="px-6 py-3 border">
              <img
                v-if="admin.image"
                :src="admin.image"
                alt="profile"
                class="w-12 h-12 rounded-full object-cover border shadow"
              />
              <div
                v-else
                class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold shadow"
              >
                {{ admin.name.charAt(0) }}
              </div>
            </td>
            <td class="px-6 py-3 border font-semibold text-gray-800">{{ admin.name }}</td>
            <td class="px-6 py-3 border text-gray-600">{{ admin.email }}</td>
            <td class="px-6 py-3 border">{{ admin.mobile }}</td>
            <td class="px-6 py-3 border capitalize">
              <span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">
                {{ admin.role }}
              </span>
            </td>
            <td class="px-6 py-3 border">
              <span
                :class="[
                  'px-2 py-1 text-xs rounded-md font-medium',
                  admin.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                ]"
              >
                {{ admin.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-3 border text-sm text-gray-500">
              {{ formatDate(admin.createdAt) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!filteredAdmins.length" class="text-center py-6 text-gray-500">
        No Sub Admins found.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchListOfSubAdmins } from '@/services/useApiServices'
import router from '@/router'

interface subAdmins {
  _id: string
  image: string
  name: string
  email: string
  mobile: number
  role: string
  isActive: boolean
  createdAt: string
}

const subAdmins = ref<subAdmins[]>([])
const search = ref('')
const loading = ref(true)

const filteredAdmins = computed(() =>
  subAdmins.value.filter(
    (a) =>
      a.name.toLowerCase().includes(search.value.toLowerCase()) ||
      a.email.toLowerCase().includes(search.value.toLowerCase()),
  ),
)

const handleSubAdminList = async () => {
  try {
    loading.value = true
    const res = await fetchListOfSubAdmins()
    if (res.data.success) subAdmins.value = res.data.data.subAdmins
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

onMounted(() => {
  handleSubAdminList()
})
</script>
