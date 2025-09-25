<template>
  <div class="max-w-screen-lg mx-auto p-6">
    <!-- Loader -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <i class="pi pi-spin pi-spinner text-4xl text-gray-600"></i>
    </div>

    <!-- If Theater Data Exists -->
    <Card
      v-else-if="TheaterData"
      class="shadow-3 border-round-2xl overflow-hidden hover:shadow-6 transition-all duration-300"
    >
      <!-- Card Header (Theater Image + Featured Badge) -->
      <template #header>
        <div class="relative">
          <img
            :src="TheaterData.image"
            alt="Theater Image"
            class="w-full h-[40vh] object-cover border-round-top-2xl"
          />
          <Tag
            value="Featured"
            severity="warning"
            class="absolute top-3 left-3 shadow-md px-3 py-2 font-semibold"
          />
        </div>
      </template>

      <!-- Card Title & Subtitle -->
      <template #title>
        <div class="flex align-items-center justify-between">
          <h2 class="text-3xl font-bold text-900 m-0">
            {{ TheaterData.name }}
          </h2>
          <Tag
            :value="`${TheaterData.no_of_screens} Screens`"
            severity="success"
            class="px-3 py-2 font-medium text-base"
          />
        </div>
      </template>

      <template #subtitle>
        <div class="flex align-items-center gap-2 text-color-secondary">
          <i class="pi pi-map-marker text-primary"></i>
          <span>
            {{ TheaterData.location }}
            <span v-if="TheaterData.city">
              , {{ TheaterData.city.name }}, {{ TheaterData.city.state }}
            </span>
          </span>
        </div>
      </template>

      <!-- Card Content -->
      <template #content>
        <Divider />

        <!-- Owner Info -->
        <div v-if="TheaterData.ownerId" class="mt-4">
          <h3 class="font-semibold mb-3 text-lg text-800 flex items-center gap-2">
            <i class="pi pi-id-card text-primary"></i>
            Owner Details
          </h3>

          <div class="flex flex-column gap-3">
            <!-- Owner Name -->
            <div class="flex align-items-center gap-2">
              <Avatar icon="pi pi-user" class="mr-2 bg-primary text-white" shape="circle" />
              <span class="font-medium">{{ TheaterData.ownerId.name }}</span>
            </div>

            <!-- Owner Email -->
            <div class="flex align-items-center gap-2">
              <i class="pi pi-envelope text-primary"></i>
              <span>{{ TheaterData.ownerId.email }}</span>
            </div>

            <!-- Owner Mobile -->
            <div class="flex align-items-center gap-2">
              <i class="pi pi-phone text-primary"></i>
              <span>{{ TheaterData.ownerId.mobile }}</span>
            </div>

            <!-- Owner Role -->
            <Tag
              :value="TheaterData.ownerId.role"
              severity="info"
              class="w-max px-3 py-1 font-medium text-sm"
            />
          </div>
        </div>
      </template>

      <!-- Card Footer -->
      <template #footer>
        <div class="flex justify-content-end border-top-1 surface-border pt-4">
          <Button
            label="View Screens"
            icon="pi pi-tv"
            iconPos="left"
            severity="secondary"
            outlined
            class="font-semibold"
            @click="viewScreenList(TheaterData._id)"
          />
        </div>
      </template>
    </Card>

    <!-- No Data -->
    <Card v-else class="p-5 text-center border-round-xl shadow-2 bg-red-50">
      <template #content>
        <div class="flex flex-column items-center gap-3">
          <i class="pi pi-exclamation-triangle text-red-500 text-4xl"></i>
          <span class="font-semibold text-red-600">Data not found!</span>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
/* ---------------- Imports ---------------- */
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { fetchtheaterdetailes } from '@/services/useApiServices'
import { Avatar, Button, Card, Divider, Tag } from 'primevue'

/* ---------------- State ---------------- */
const TheaterId = ref<string>('')
const TheaterData = ref<any>(null)
const loading = ref(false)

/* ---------------- Router ---------------- */
const route = useRoute()
TheaterId.value = route.params.id as string

/* ---------------- API Call ---------------- */
const handleFetchTheaterDetailesById = async () => {
  loading.value = true
  try {
    const res = await fetchtheaterdetailes(TheaterId.value)

    if (res.data.success) {
      TheaterData.value = res.data.data
    } else {
      TheaterData.value = null
    }
  } catch (error) {
    console.error('Error fetching theater details:', error)
    TheaterData.value = null
  } finally {
    loading.value = false
  }
}

/* ---------------- Navigation ---------------- */
const viewScreenList = (id: string) => {
  router.push({ name: 'ScreenList', params: { id } })
}

/* ---------------- Lifecycle ---------------- */
onMounted(() => {
  handleFetchTheaterDetailesById()
})
</script>
