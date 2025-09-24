<template>
  <div class="max-w-7xl mx-auto p-6 text-white min-h-screen">
    <!-- Header -->
    <h1 class="text-3xl font-bold text-red-500 mb-6 tracking-wide">
      {{ editShowId ? 'Edit Show' : 'Add Show' }}
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left: Form -->
      <div class="lg:col-span-1">
        <Card class="bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl">
          <template #title>
            <h2 class="text-xl font-semibold text-red-400">Show Details</h2>
          </template>

          <template #content>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Theater -->
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-300">Theater</label>
                <Dropdown
                  v-model="form.theaterId"
                  :options="theaters"
                  optionLabel="name"
                  optionValue="_id"
                  placeholder="Select Theater"
                  class="w-full"
                  :disabled="isEditMode"
                />
              </div>

              <!-- Screen -->
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-300">Screen</label>
                <Dropdown
                  v-model="form.screenId"
                  :options="screen"
                  optionLabel="name"
                  optionValue="_id"
                  placeholder="Select Screen"
                  class="w-full"
                  :disabled="isEditMode"
                />
              </div>

              <!-- Show Dates -->
              <div class="flex gap-4">
                <div class="w-1/2">
                  <label class="block text-sm font-medium mb-2 text-gray-300">Show Start</label>
                  <Calendar
                    v-model="form.showStartDate"
                    dateFormat="dd-mm-yy"
                    class="w-full"
                    showIcon
                    :disabled="isEditMode"
                  />
                </div>
                <div class="w-1/2">
                  <label class="block text-sm font-medium mb-2 text-gray-300">Show End</label>
                  <Calendar
                    v-model="form.showEndDate"
                    dateFormat="dd-mm-yy"
                    class="w-full"
                    showIcon
                    :disabled="isEditMode"
                  />
                </div>
              </div>

              <!-- Start Time -->
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-300">Start Time</label>
                <Calendar
                  v-model="timeValue"
                  timeOnly
                  hourFormat="24"
                  class="w-full"
                  showIcon
                  :disabled="isEditMode"
                />
              </div>

              <!-- Ticket Price -->
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-300">Ticket Price</label>
                <InputNumber
                  v-model="form.ticketPrice"
                  mode="currency"
                  currency="INR"
                  locale="en-IN"
                  class="w-full"
                />
              </div>

              <!-- Show Status -->
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-300">Show Status</label>
                <div class="flex items-center gap-6">
                  <div class="flex items-center gap-2">
                    <RadioButton
                      inputId="active"
                      name="status"
                      value="ACTIVE"
                      v-model="form.isActive"
                    />
                    <label for="active" class="text-sm">Active</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioButton
                      inputId="cancelled"
                      name="status"
                      value="CANCELLED"
                      v-model="form.isActive"
                    />
                    <label for="cancelled" class="text-sm">Cancelled</label>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-3 pt-4">
                <Button label="Cancel" severity="secondary" @click="handleCancel" outlined />
                <Button :label="SubmitBtnLable" icon="pi pi-save" type="submit" severity="danger" />
              </div>
            </form>
          </template>
        </Card>
      </div>

      <!-- Right: Movies -->
      <div class="lg:col-span-2">
        <h2 class="text-xl font-semibold mb-4 text-red-400">Available Movies</h2>

        <div class="h-[600px] overflow-y-auto pr-2 custom-scroll">
          <!-- Movie Selection -->
          <div v-if="!isEditMode" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              v-for="movie in movies"
              :key="movie._id"
              class="bg-gray-900 shadow-lg rounded-2xl overflow-hidden hover:shadow-red-500/40 hover:scale-[1.02] transition-transform duration-300 border border-gray-800"
            >
              <template #header>
                <div class="relative group">
                  <!-- Movie Poster -->
                  <img :src="movie.posterUrl" alt="Movie Poster" class="w-full h-72 object-cover" />

                  <!-- Overlay -->
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-4"
                  >
                    <!-- Title -->
                    <h3
                      class="text-white text-lg font-bold truncate group-hover:scale-105 transition-transform"
                    >
                      {{ movie.title }}
                    </h3>
                    <!-- Release Date -->
                    <div class="flex items-center text-xs text-gray-300 mt-1">
                      <i class="pi pi-calendar mr-2"></i>
                      {{ new Date(movie.releaseDate).toLocaleDateString() }}
                    </div>
                  </div>
                </div>
              </template>

              <template #footer>
                <Button
                  :label="form.movieId === movie._id ? 'Selected' : 'Select Movie'"
                  icon="pi pi-check"
                  class="w-full"
                  :severity="form.movieId === movie._id ? 'danger' : 'secondary'"
                  @click="form.movieId = movie._id"
                />
              </template>
            </Card>
          </div>

          <!-- Edit Mode Movie Preview -->
          <div
            v-else
            class="p-6 rounded-2xl border border-gray-800 shadow-lg bg-cover bg-center h-80"
            :style="{ backgroundImage: `url(${editBackdropUrl})` }"
          >
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Posters -->
              <div class="flex-shrink-0">
                <img :src="editPosterUrl" class="w-40 rounded-lg shadow-lg" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-red-400">{{ editMovieTitle }}</h3>
                <p class="text-gray-300 mt-2">Duration: {{ editMovieDuration }} mins</p>
                <p class="text-gray-300">Languages: {{ editMovieLanguage.join(', ') }}</p>
                <p class="text-gray-300">Rating: ⭐ {{ editMovieRating }}</p>
                <p class="text-gray-300">
                  Release: {{ new Date(editMovieRelease).toLocaleDateString() }}
                </p>
                <p class="text-gray-300">Genres: {{ editMovieGenres.join(', ') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from '@/router'
import {
  addShows,
  fetchMovieList,
  fetchScreenList,
  fetchtheaterList,
  showDetails,
  updateShow,
} from '@/services/useApiServices'
import { userAuthStore } from '@/stores/userAuthStore'
import { Button, Calendar, Card, Dropdown, InputNumber, RadioButton } from 'primevue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const form = ref({
  movieId: null,
  theaterId: null,
  screenId: null,
  showStartDate: null,
  showEndDate: null,
  startTime: null,
  ticketPrice: null,
  isActive: 'ACTIVE',
})

const movies = ref([])
const theaters = ref([])
const screen = ref([])

const editBackdropUrl = ref('')
const editPosterUrl = ref('')
const editMovieTitle = ref('')
const editMovieDuration = ref(null)
const editMovieLanguage = ref([])
const editMovieRating = ref(null)
const editMovieRelease = ref('')
const editMovieGenres = ref([])

const editShowId = ref('')

const route = useRoute()

editShowId.value = route.params.id

const store = userAuthStore()

const SubmitBtnLable = computed(() => {
  if (editShowId.value) {
    return 'Edit Show'
  } else {
    return 'Add Show'
  }
})

// Fetch movies
const fetchMovies = async () => {
  try {
    const res = await fetchMovieList(0, 10, '', '')
    if (res.data.success) {
      movies.value = res.data.data.movies
    }
  } catch (error) {
    console.log(error)
  }
}

//Fetch theaters

const handleFetchTheaterList = async () => {
  try {
    const res = await fetchtheaterList(store.OwnerId, '')
    if (res.data.success) {
      theaters.value = res.data.data.theaters
    }
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => form.value.theaterId,
  (newTheaterId) => {
    console.log('new theater id:', newTheaterId)
    handleFetchscreenList(newTheaterId)
  },
)

const timeValue = computed({
  get() {
    if (!form.value.startTime) return null
    return new Date(form.value.startTime)
  },
  set(val) {
    form.value.startTime = val
  },
})

const isEditMode = computed(() => !!editShowId.value)

//Fetch screens

const handleFetchscreenList = async () => {
  try {
    const res = await fetchScreenList(form.value.theaterId)

    if (res.data.success) {
      alert(res.data.message)
      screen.value = res.data.data.screens
    }
  } catch (error) {
    console.log(error)
  }
}

const handleSubmit = async () => {
  try {
    if (editShowId.value) {
      alert('edit api calling....')

      const payload = {
        status: form.value.isActive,
        ticketPrice: form.value.ticketPrice,
      }

      const res = await updateShow(editShowId.value, payload)

      if (res.data.success) {
        alert(res.data.message)
      }
    } else {
      alert('add api calling....')

      const payload = {
        movieId: form.value.movieId,
        screenId: form.value.screenId,
        theaterId: form.value.theaterId,
        startTime: form.value.startTime ? form.value.startTime.toISOString() : null,
        showDate: form.value.showStartDate ? form.value.showStartDate.toISOString() : null,
        showEndDate: form.value.showEndDate ? form.value.showEndDate.toISOString() : null,
        ticketPrice: form.value.ticketPrice,
      }

      const res = await addShows(payload)

      if (res.data.success) {
        alert(res.data.message)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const handleCancel = () => {
  router.push({ name: 'ShowList' })
}

const fetchShowDetails = async (id) => {
  alert('start to fetch Details')

  try {
    const res = await showDetails(id)

    if (res.data.success) {
      alert(res.data.message)
      form.value.movieId = res.data.data.movieId._id
      form.value.theaterId = res.data.data.theaterId._id
      form.value.screenId = res.data.data.screenId._id
      form.value.showStartDate = new Date(res.data.data.showDate)
      form.value.showEndDate = new Date(res.data.data.showEndDate)
      form.value.startTime = new Date(res.data.data.startTime)
      form.value.ticketPrice = res.data.data.ticketPrice
      form.value.isActive = res.data.data.status
      editBackdropUrl.value = res.data.data.movieId.backdropUrl
      editPosterUrl.value = res.data.data.movieId.posterUrl
      editMovieTitle.value = res.data.data.movieId.title
      editMovieDuration.value = res.data.data.movieId.duration
      editMovieLanguage.value = res.data.data.movieId.languages
      editMovieRating.value = res.data.data.movieId.rating
      editMovieRelease.value = res.data.data.movieId.releaseDate
      editMovieGenres.value = res.data.data.movieId.genres
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  fetchMovies()
  handleFetchTheaterList()
  if (editShowId.value) {
    fetchShowDetails(editShowId.value)
  }
})
</script>
