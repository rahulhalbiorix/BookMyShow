<template>
  <div class="max-w-6xl mx-auto px-6 py-8">
    <!-- Backdrop -->
    <div class="relative rounded-2xl overflow-hidden shadow-lg">
      <img
        v-if="movieData"
        :src="movieData.backdropUrl"
        alt="Backdrop"
        class="w-full h-96 object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
      ></div>

      <!-- Poster + Title -->
      <div v-if="movieData" class="absolute bottom-6 left-6 flex gap-6">
        <img
          :src="movieData.posterUrl"
          alt="Poster"
          class="w-40 h-60 object-cover rounded-xl shadow-xl"
        />
        <div class="text-white">
          <h1 class="text-3xl font-extrabold mb-2">{{ movieData.title }}</h1>
          <p class="text-sm text-gray-300">
            {{ movieData.genres.join(', ') }} • {{ movieData.duration }} min •
            {{ formatDate(movieData.releaseDate) }}
          </p>
          <div class="flex items-center gap-4 mt-3">
            <span class="flex items-center gap-1 text-yellow-400 font-semibold">
              <i class="pi pi-star"></i>
              {{ movieData.rating > 0 ? movieData.rating : 'N/A' }}
            </span>
            <span
              v-for="lang in movieData.languages"
              :key="lang"
              class="px-3 py-1 bg-pink-600/80 text-white rounded-full text-xs font-semibold"
            >
              {{ lang.toUpperCase() }}
            </span>
          </div>
          <div class="mt-3 border-2 bg-amber-200">
            <Button label="BooK Ticket" severity="danger" @click="handleBookTicketBtn"></Button>
          </div>
        </div>
      </div>
    </div>

    <!-- About -->
    <section v-if="movieData" class="mt-10">
      <h2 class="text-xl font-bold text-gray-900 mb-3">About the Movie</h2>
      <p class="text-gray-700 leading-relaxed">{{ movieData.overview }}</p>
    </section>

    <!-- Cast -->
    <section v-if="movieData?.cast?.length" class="mt-10">
      <h2 class="text-xl font-bold text-gray-900 mb-5">Cast</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        <div v-for="actor in movieData.cast" :key="actor.name" class="flex flex-col items-center">
          <img
            :src="actor.profilePath ? tmdbImage(actor.profilePath) : fallbackImg"
            alt="Cast"
            class="w-24 h-24 rounded-full object-cover shadow-md"
          />
          <p class="mt-2 text-sm font-semibold text-gray-800">
            {{ actor.name }}
          </p>
          <p class="text-xs text-gray-500">{{ actor.character }}</p>
        </div>
      </div>
    </section>

    <!-- Crew -->
    <section v-if="movieData?.crew?.length" class="mt-10">
      <h2 class="text-xl font-bold text-gray-900 mb-5">Crew</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        <div v-for="member in movieData.crew" :key="member.name" class="flex flex-col items-center">
          <img
            :src="member.profilePath ? tmdbImage(member.profilePath) : fallbackImg"
            alt="Crew"
            class="w-24 h-24 rounded-full object-cover shadow-md"
          />
          <p class="mt-2 text-sm font-semibold text-gray-800">
            {{ member.name }}
          </p>
          <p class="text-xs text-gray-500">{{ member.job }}</p>
        </div>
      </div>
    </section>

    <!-- Videos -->
    <section v-if="movieData?.videos?.length" class="mt-10">
      <h2 class="text-xl font-bold text-gray-900 mb-5">Trailers & Videos</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          v-for="video in movieData.videos"
          :key="video.key"
          class="rounded-xl overflow-hidden shadow-md"
        >
          <iframe
            class="w-full h-64"
            :src="`https://www.youtube.com/embed/${video.key}`"
            frameborder="0"
            allowfullscreen
          ></iframe>
          <p class="text-sm font-semibold text-gray-700 py-2 px-2">
            {{ video.name }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { fetchSingleMovie, fetchUserListShow } from '@/services/useApiServices'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import fallbackImg from '@/assets/female_profile_photo.png'
import { Button } from 'primevue'
import router from '@/router'

export interface Movie {
  _id: string
  tmdbId: number
  __v: number
  backdropUrl: string
  cast: Cast[]
  categories: string[]
  createdAt: string
  crew: Crew[]
  duration: number
  genres: string[]
  languages: string[]
  overview: string
  posterUrl: string
  rating: number
  releaseDate: string
  title: string
  updatedAt: string
  videos: Video[]
}

interface Cast {
  name: string
  character: string
  profilePath: string | null
}

interface Crew {
  name: string
  job: string
  profilePath: string | null
}

interface Video {
  key: string
  name: string
  site: string
  type: string
}

const movieId = ref<string>('')
const movieData = ref<Movie | null>(null)

const route = useRoute()
movieId.value = route.params.id as string

const handleBookTicketBtn = () => {
  router.push({ name: 'AllMovieShowList', params: { movieId: movieId.value } })
}

const fetchMovieData = async () => {
  try {
    const res = await fetchSingleMovie(movieId.value)
    if (res.data?.success) {
      console.log(res.data.message)
      movieData.value = res.data.data
    }
  } catch (error) {
    console.error('Error fetching movie:', error)
  }
}

const tmdbImage = (path: string) => `https://image.tmdb.org/t/p/w200${path}`

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

onMounted(() => {
  fetchMovieData()
})
</script>
