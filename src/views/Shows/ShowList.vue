<template>
  <div class="max-w-7xl mx-auto p-6 space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-800">Shows</h1>
      <Button
        label="Add Show"
        icon="pi pi-plus"
        severity="success"
        class="shadow-md"
        @click="handleAddShow"
      />
    </div>

    <!-- Date Selector -->
    <div class="flex justify-center gap-3 overflow-x-auto pb-3">
      <div
        v-for="(date, index) in next7Days"
        :key="index"
        @click="selectedDate = date.fullDate"
        class="cursor-pointer px-4 py-3 rounded-xl shadow-md border text-center min-w-[90px] transition"
        :class="
          selectedDate === date.fullDate ? 'bg-red-600 text-white' : 'bg-white hover:bg-red-100'
        "
      >
        <div class="text-lg font-bold">{{ date.day }}</div>
        <div class="text-sm">{{ date.date }} {{ date.month }}</div>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <ProgressSpinner />
    </div>

    <!-- Shows List -->
    <div v-else-if="shows.length > 0" class="space-y-6">
      <div
        v-for="show in shows"
        :key="show._id"
        class="flex flex-col md:flex-row bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
      >
        <!-- Movie Poster -->
        <div class="md:w-1/4 w-full">
          <img
            :src="show.movieId.posterUrl"
            alt="Movie Poster"
            class="w-full h-48 md:h-full object-cover"
          />
        </div>

        <!-- Details -->
        <div class="flex-1 p-4 flex flex-col justify-between">
          <div>
            <!-- Show Status Badge -->
            <div class="mb-2 flex justify-self-end">
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                :class="{
                  'bg-green-100 text-green-700': show.status === 'ACTIVE',
                  'bg-red-100 text-red-700': show.status === 'CANCELLED',
                }"
              >
                {{ show.status }}
              </span>
            </div>

            <!-- Movie Title -->
            <h2 class="text-xl font-bold text-gray-800">
              {{ show.movieId.title }}
            </h2>

            <!-- Duration & Rating -->
            <p class="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <span class="flex items-center gap-1">
                <i class="pi pi-clock text-gray-400"></i>
                {{ show.movieId.duration }}
              </span>
              <span class="flex items-center gap-1">
                <i class="pi pi-star-fill text-yellow-500"></i>
                {{ show.movieId.rating > 0 ? show.movieId.rating : 'NA' }}
              </span>
            </p>

            <!-- Theater Info -->
            <p class="mt-2 text-gray-700">
              <span class="font-semibold text-red-500">{{ show.theaterId.name }}</span>
            </p>
            <p class="text-sm text-gray-500 flex items-center gap-2">
              <i class="pi pi-map-marker"></i>
              {{ show.theaterId.location }}
            </p>
          </div>

          <!-- Show Time & Price -->
          <div class="mt-4 flex flex-wrap items-center gap-3">
            <span
              class="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium shadow-md"
            >
              {{ formatTime(show.startTime) }}
            </span>
            <span class="text-gray-700 font-semibold">₹{{ show.ticketPrice }}</span>
          </div>

          <!-- Actions -->
          <div class="mt-4 flex gap-3">
            <Button
              label="Edit"
              icon="pi pi-pencil"
              severity="info"
              class="px-4"
              @click="handleEditShow(show._id)"
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              severity="danger"
              class="px-4"
              @click="handleDeleteShow(show._id)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center text-gray-500 mt-12 text-lg">
      No shows available for this date.
    </div>
  </div>
</template>

<script setup>
import router from '@/router'
import { deleteShows, showList } from '@/services/useApiServices'
import { Button, ProgressSpinner } from 'primevue'

import { ref, watch } from 'vue'

const shows = ref([])
const loading = ref(false)

// Generate next 7 days
const next7Days = []
const today = new Date()
for (let i = 0; i < 7; i++) {
  const d = new Date(today)
  d.setDate(today.getDate() + i)
  next7Days.push({
    fullDate: d.toISOString().split('T')[0],
    day: d.toLocaleDateString('en-US', { weekday: 'short' }),
    date: d.getDate(),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
  })
}

const selectedDate = ref(next7Days[0].fullDate)

// Fetch shows
const handleFetchShow = async (dateTime) => {
  try {
    loading.value = true
    const res = await showList('', '', '', dateTime)
    if (res.data.success) {
      shows.value = res.data.data
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

watch(
  selectedDate,
  (newDate) => {
    handleFetchShow(newDate)
  },
  { immediate: true },
)

const formatTime = (time) => {
  return new Date(time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleAddShow = () => {
  router.push({ name: 'modifyShowList' })
}
const handleEditShow = (id) => {
  router.push({ name: 'modifyShowList', params: { id } })
}
const handleDeleteShow = async (id) => {
  try {
    loading.value = true
    const res = await deleteShows(id)
    if (res.data.success) {
      alert(res.data.message)
      handleFetchShow(selectedDate.value)
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
</script>
