<template>
  <main class="p-6 space-y-10">
    <!-- Upcoming Movies Section -->
    <section>
      <h2 class="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
        <i class="pi pi-clock text-blue-500"></i> Upcoming Movies
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="movie in UpcomingMovieList"
          :key="movie._id"
          class="shadow-lg rounded-xl overflow-hidden surface-card hover:shadow-2xl transition"
        >
          <MovieCard :movieDetailes="movie" />
        </div>
      </div>
    </section>

    <!-- Now Showing Movies Section -->
    <section>
      <h2 class="text-2xl font-bold mb-4 text-pink-700 flex items-center gap-2">
        <i class="pi pi-video text-pink-500"></i> Now Showing
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="movie in presentMovieList"
          :key="movie._id"
          class="shadow-lg rounded-xl overflow-hidden surface-card hover:shadow-2xl transition"
        >
          <MovieCard :movieDetailes="movie" />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import MovieCard from '@/components/MovieCard.vue'

import { fetchMovieList } from '@/services/useApiServices'

import { onMounted, ref } from 'vue'

// fetch Movie list and assign them to variable

const UpcomingMovieList = ref<any[]>([])
const presentMovieList = ref<any[]>([])

const retriveMovieList = async () => {
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
    console.log(error)
  }
}

onMounted(() => {
  retriveMovieList()
})
</script>
