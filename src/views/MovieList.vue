<template>
  <main class="p-6 space-y-10">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".8s"
      />
    </div>

    <!-- Movies Section -->
    <div v-else>
      <!-- Upcoming Movies Section -->
      <section>
        <h2 class="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
          <i class="pi pi-clock text-blue-500"></i> Upcoming Movies
        </h2>
        <div
          v-if="UpcomingMovieList.length"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <div
            v-for="movie in UpcomingMovieList"
            :key="movie._id"
            class="shadow-lg rounded-xl overflow-hidden surface-card hover:shadow-2xl transition"
          >
            <MovieCard :movieDetailes="movie" />
          </div>
        </div>
        <p v-else class="text-gray-500 italic">No upcoming movies available.</p>
      </section>

      <!-- Now Showing Movies Section -->
      <section>
        <h2 class="text-2xl font-bold mb-4 text-pink-700 flex items-center gap-2">
          <i class="pi pi-video text-pink-500"></i> Now Showing
        </h2>
        <div
          v-if="presentMovieList.length"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <div
            v-for="movie in presentMovieList"
            :key="movie._id"
            class="shadow-lg rounded-xl overflow-hidden surface-card hover:shadow-2xl transition"
          >
            <MovieCard :movieDetailes="movie" />
          </div>
        </div>
        <p v-else class="text-gray-500 italic">No movies currently showing.</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import MovieCard from '@/components/MovieCard.vue'
import { fetchMovieList } from '@/services/useApiServices'
import { ProgressSpinner } from 'primevue'
import { onMounted, ref } from 'vue'

// states
const UpcomingMovieList = ref<any[]>([])
const presentMovieList = ref<any[]>([])
const loading = ref(true)

const retriveMovieList = async () => {
  loading.value = true
  try {
    const res = await fetchMovieList(0, 1, '', '')
    res.data.data.movies.forEach((obj: any) => {
      if (obj.categories.includes('Upcoming')) {
        UpcomingMovieList.value.push(obj)
      } else {
        presentMovieList.value.push(obj)
      }
    })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  retriveMovieList()
})
</script>
