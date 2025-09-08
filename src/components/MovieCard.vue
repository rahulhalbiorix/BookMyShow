<template>
  <div
    class="relative w-72 bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 hover:shadow-2xl transition-transform duration-300"
    @click="handleMovieOverview(movieDetailes._id)"
  >
    <!-- Poster -->
    <div class="relative">
      <img :src="movieThumbnail" alt="Movie Poster" class="w-full h-96 object-cover" />

      <!-- Gradient overlay -->
      <div
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
      >
        <h2 class="text-xl font-bold text-white truncate">
          {{ movieDetailes.title }}
        </h2>
        <div class="flex items-center justify-between text-sm text-gray-200 mt-1">
          <span class="flex items-center gap-1">
            <i class="pi pi-star text-yellow-400"></i> {{ movieDetailes.rating }}
          </span>
          <span class="flex items-center gap-1">
            <i class="pi pi-clock text-blue-400"></i> {{ movieDetailes.duration }}
          </span>
        </div>
      </div>
    </div>

    <!-- Languages -->
    <div class="px-4 py-3 bg-gray-50">
      <span class="text-gray-800 font-semibold text-sm">Available in:</span>
      <div class="flex flex-wrap gap-2 mt-2">
        <span
          v-for="lang in movieDetailes.languages"
          :key="lang"
          class="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold"
        >
          {{ lang }}
        </span>
      </div>
      <div class="bg-green-200">
        {{ movieDetailes._id }}
      </div>
    </div>

    <!-- Action Button -->
    <!-- <div class="p-4 border-t flex justify-center">
      <Button
        label="Book Tickets"
        icon="pi pi-ticket"
        class="px-6 py-2 font-semibold rounded-full shadow-md"
        severity="danger"
      />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { Button } from 'primevue'
import { computed } from 'vue'

const props = defineProps<{
  movieDetailes: {
    _id: string
    title: string
    posterUrl: string
    rating: string
    duration: string
    languages: string[]
  }
}>()

const fallBackImage = 'src/assets/ai-generated-9095259_1280.jpg'

const movieThumbnail = computed<string>(() => {
  return props.movieDetailes.posterUrl && props.movieDetailes.posterUrl !== ''
    ? props.movieDetailes.posterUrl
    : fallBackImage
})

const handleMovieOverview = (id: string) => {
  router.push({ name: 'MovieDetails', params: { id } })
  console.log('redirecting on', id)
}
</script>
