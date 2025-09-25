<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Movie Header -->
    <div class="flex items-center gap-6 mb-8">
      <img
        v-if="ShowData.length"
        :src="ShowData[0].movieId.posterUrl"
        alt="Movie Poster"
        class="w-28 h-40 object-cover rounded-lg shadow-md"
      />
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">
          {{ ShowData.length ? ShowData[0].movieId.title : '' }}
        </h1>
        <p class="text-sm text-gray-600 mt-2" v-if="ShowData.length">
          {{ ShowData[0].movieId.genres.join(', ') }} • {{ ShowData[0].movieId.duration }} min •
          {{ ShowData[0].movieId.languages.join(', ').toUpperCase() }}
        </p>
      </div>
    </div>

    <!-- Date Selector -->
    <div class="flex justify-center gap-3 overflow-x-auto pb-4 mb-6 border-b">
      <div
        v-for="(date, index) in next7Days"
        :key="index"
        @click="selectedDate = date.fullDate"
        class="cursor-pointer px-5 py-3 rounded-xl border text-center min-w-[90px] transition-all duration-200"
        :class="
          selectedDate === date.fullDate
            ? 'bg-red-600 text-white shadow-lg scale-105'
            : 'bg-white hover:bg-red-50'
        "
      >
        <div class="text-lg font-bold">{{ date.day }}</div>
        <div class="text-sm">{{ date.date }} {{ date.month }}</div>
      </div>
    </div>

    <!-- Shows List -->
    <h2 class="text-xl font-bold mb-4">Available Shows</h2>

    <div
      v-if="ShowData.length"
      v-for="show in ShowData"
      :key="show._id"
      class="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-100 hover:shadow-lg transition"
    >
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- Theater & Screen -->
        <div>
          <p class="font-semibold text-gray-900 text-lg">🎭 {{ show.theaterId.name }}</p>
          <p class="text-sm text-gray-600">
            {{ show.theaterId.location }} • Screen: {{ show.screenId.name }}
          </p>
          <p class="text-xs text-gray-500">Seats: {{ show.screenId.totalSeats }}</p>
        </div>

        <!-- Show Timing -->
        <div class="text-center">
          <p class="text-gray-800 font-bold text-lg">
            {{ formatTime(show.startTime) }}
          </p>
          <p class="text-sm text-gray-500">Ends at {{ formatTime(show.endTime) }}</p>
        </div>

        <!-- Price + Status + Action -->
        <div class="flex items-center gap-3">
          <span class="text-lg font-bold text-green-700"> ₹{{ show.ticketPrice }} </span>
          <span
            class="px-3 py-1 rounded-full text-xs font-semibold"
            :class="
              show.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            "
          >
            {{ show.status }}
          </span>

          <Button
            v-if="show.status === 'ACTIVE'"
            label="Book"
            severity="danger"
            size="small"
            @click="bookShow(show)"
          />
        </div>
      </div>
    </div>

    <!-- No Shows -->
    <div v-else class="text-center py-10 text-gray-500">No shows available for this date.</div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { fetchUserListShow } from '@/services/useApiServices'
import { Button } from 'primevue'
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

/* --------------------
   Interfaces
-------------------- */
interface Movie {
  posterUrl: string
  genres: string[]
  languages: string[]
  title: string
  duration: number
}
interface Theater {
  name: string
  location: string
}
interface Screen {
  name: string
  totalSeats: number
  _id: string
}
interface Show {
  _id: string
  movieId: Movie
  theaterId: Theater
  screenId: Screen
  showDate: string
  startTime: string
  endTime: string
  ticketPrice: number
  status: string
}

/* --------------------
   State
-------------------- */
const route = useRoute()
const MovieId = ref<string>((route.params.movieId as string) || '')
const ShowData = ref<Show[]>([])
const selectedDate = ref<string>('')

/* --------------------
   Date Generation
-------------------- */
const next7Days = (() => {
  const days = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      fullDate: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    })
  }
  return days
})()
selectedDate.value = next7Days[0].fullDate

/* --------------------
   Helpers
-------------------- */
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
function formatTime(time: string) {
  return new Date(time).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

/* --------------------
   API Fetch
-------------------- */
const fetchMovieShowList = async () => {
  try {
    const res = await fetchUserListShow('', '', MovieId.value, selectedDate.value)
    if (res.data.success) {
      ShowData.value = res.data.data
    } else {
      ShowData.value = []
    }
  } catch (error) {
    console.error('Error fetching shows:', error)
    ShowData.value = []
  }
}

/* --------------------
   Watchers & Lifecycle
-------------------- */
watch(selectedDate, () => {
  fetchMovieShowList()
})
onMounted(() => {
  fetchMovieShowList()
})

/* --------------------
   Actions
-------------------- */
const bookShow = (show: Show) => {
  console.log(show)
  router.push({
    name: 'ViewSeatLayout',
    params: { id: show.screenId._id },
    query: { showId: show._id },
  })
}
</script>
