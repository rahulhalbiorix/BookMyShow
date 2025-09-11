<template>
  <div class="max-w-6xl mx-auto p-6 space-y-8">
    <!-- Toast & Confirm Dialog -->
    <Toast />
    <ConfirmDialog />

    <!-- Theater Cards -->
    <div v-for="theoter in theoters" :key="theoter._id">
      <Card
        class="rounded-2xl overflow-hidden shadow-lg bg-white/80 backdrop-blur-md border border-gray-200 hover:shadow-2xl transition duration-300"
      >
        <!-- Title -->
        <template #title>
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold text-gray-800 tracking-tight">
              {{ theoter.name }}
            </h2>
            <Tag
              :value="theoter.isActive ? 'Active' : 'Inactive'"
              :severity="theoter.isActive ? 'success' : 'danger'"
              class="px-4 py-1 text-sm rounded-full"
            />
          </div>
        </template>

        <!-- Content -->
        <template #content>
          <div class="grid md:grid-cols-2 gap-6 items-center">
            <!-- Theater Image -->
            <div class="relative group">
              <img
                :src="theoter.image"
                alt="Theater"
                class="w-full h-72 object-cover rounded-xl shadow-md transform transition duration-300 group-hover:scale-105"
              />
              <!-- Overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition"
              ></div>
            </div>

            <!-- Theater Info -->
            <div class="space-y-4 text-gray-700">
              <p class="flex items-center gap-2 text-base">
                <i class="pi pi-map-marker text-gray-500"></i>
                <span class="font-semibold text-gray-900">Location:</span>
                {{ theoter.location }}
              </p>
              <p class="flex items-center gap-2 text-base">
                <i class="pi pi-building text-gray-500"></i>
                <span class="font-semibold text-gray-900">City:</span>
                {{ theoter.city?.name || 'N/A' }},
                {{ theoter.city?.state || 'N/A' }}
              </p>
              <p class="flex items-center gap-2 text-base">
                <i class="pi pi-video text-gray-500"></i>
                <span class="font-semibold text-gray-900">Screens:</span>
                {{ theoter.no_of_screens }}
              </p>
              <p class="flex items-center gap-2 text-base">
                <i class="pi pi-calendar text-gray-500"></i>
                <span class="font-semibold text-gray-900">Created:</span>
                {{ new Date(theoter.createdAt).toLocaleDateString() }}
              </p>
            </div>
          </div>
        </template>

        <!-- Footer -->
        <template #footer>
          <div class="flex flex-wrap gap-3 justify-end mt-2">
            <Button
              label="Edit"
              icon="pi pi-pencil"
              severity="info"
              rounded
              outlined
              class="!px-4 !py-2"
              @click="editTheater(theoter)"
            />
            <Button
              :label="theoter.isActive ? 'Deactivate' : 'Activate'"
              :icon="theoter.isActive ? 'pi pi-times-circle' : 'pi pi-check-circle'"
              :severity="theoter.isActive ? 'warning' : 'success'"
              rounded
              class="!px-4 !py-2"
              @click="toggleStatus(theoter)"
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              severity="danger"
              rounded
              text
              class="!px-4 !py-2"
              @click="deleteTheater(theoter)"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Card, Tag, Toast } from 'primevue'
import { useToast } from 'primevue/usetoast'

import ConfirmDialog from 'primevue/confirmdialog'

import { onMounted, ref } from 'vue'
import { userAuthStore } from '@/stores/userAuthStore'
import { fetchTheoterList } from '@/services/useApiServices'
import { useConfirm } from 'primevue/useconfirm'
const confirm = useConfirm()

const store = userAuthStore()
const toast = useToast()

interface City {
  _id: string
  name: string
  state: string
}

interface Theoter {
  _id: string
  name: string
  location: string
  city?: City | null // allow null or missing
  no_of_screens: number
  image: string
  isActive: boolean
  createdAt: string
  // optional fields
  isRemoved?: boolean
  updatedAt?: string
  __v?: number
  ownerId?: any
}

const theoters = ref<Theoter[]>([])

// --- Actions ---
const editTheater = (theoter: Theoter) => {
  toast.add({
    severity: 'info',
    summary: 'Edit',
    detail: `Edit ${theoter.name}`,
    life: 3000,
  })
}

const deleteTheater = (theoter: Theoter) => {
  confirm.require({
    message: `Are you sure you want to delete ${theoter.name}?`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      toast.add({
        severity: 'warn',
        summary: 'Deleted',
        detail: `${theoter.name} deleted`,
        life: 3000,
      })
    },
  })
}

const toggleStatus = (theoter: Theoter) => {
  theoter.isActive = !theoter.isActive
  toast.add({
    severity: theoter.isActive ? 'success' : 'error',
    summary: 'Status Updated',
    detail: theoter.isActive ? `${theoter.name} Activated` : `${theoter.name} Deactivated`,
    life: 3000,
  })
}

// --- Fetch Theaters ---
const handleFetchTheaterList = async () => {
  try {
    const res = await fetchTheoterList(store.OwnerId, '')
    if (res.data.success) {
      theoters.value = res.data.data.theaters
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  handleFetchTheaterList()
})
</script>
