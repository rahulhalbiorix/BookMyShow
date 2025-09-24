<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">Seat Layout</h1>

    <div class="flex justify-end">
      <Button
        label="Update Seat Layout"
        severity="info"
        icon="pi pi-plus"
        class="mb-4"
        @click="handleUpdateLayout"
      />
    </div>

    <!-- Rows -->
    <div v-if="rowsArray.length" class="border p-4 rounded-lg shadow">
      <div v-for="rowObj in rowsArray" :key="rowObj.row" class="mb-6">
        <!-- Row header -->
        <div class="flex justify-between items-center mb-2 px-4">
          <h2 class="font-semibold text-lg">Row {{ rowObj.row }}</h2>
          <span class="text-sm text-gray-600">
            ₹ {{ rowObj.seats[0]?.price ?? '-' }} • {{ rowObj.seats[0]?.type ?? '-' }}
          </span>
        </div>

        <!-- Seats -->
        <div class="grid grid-cols-10 gap-2 justify-center px-4">
          <div
            v-for="seat in rowObj.seats"
            :key="seat._id"
            class="seat-block flex items-center justify-center rounded-md text-sm font-medium border select-none"
            :class="seatClass(seat)"
          >
            {{ seat.seatNumber }}
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else class="text-center text-red-500 font-semibold">
      {{ resMessage }}
    </div>

    <!-- Screen indicator -->
    <div class="mt-8 flex justify-center">
      <div class="bg-gray-800 text-white px-10 py-2 rounded-t-lg text-center">SCREEN</div>
    </div>

    <!-- Legend -->
    <div class="mt-6 flex justify-center gap-6 text-sm">
      <div class="flex items-center gap-2">
        <span class="w-4 h-4 rounded-sm bg-white border border-gray-300"></span> Regular
      </div>
      <div class="flex items-center gap-2">
        <span class="w-4 h-4 rounded-sm bg-blue-100 border border-blue-500"></span> Premium
      </div>
      <div class="flex items-center gap-2">
        <span class="w-4 h-4 rounded-sm bg-yellow-300 border border-yellow-500"></span> VIP
      </div>
      <div class="flex items-center gap-2">
        <span class="w-4 h-4 rounded-sm bg-red-600"></span> Booked
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchseatLayout } from '@/services/useApiServices'
import { Button } from 'primevue'
import router from '@/router'

interface Seat {
  _id: string
  row: string
  seatNumber: number
  type: 'regular' | 'premium' | 'vip'
  price: number
  isAvailable: boolean
  isBooked: boolean
}

const route = useRoute()
const screenId = ref<string>((route.params.id as string) || '')
const seats = ref<Seat[]>([])
const resMessage = ref('')

// fetch seats
const handleFetchSeatLayout = async (id: string) => {
  try {
    const res = await fetchseatLayout(id)
    if (res.data?.success) {
      seats.value = res.data.data.seatLayout.seats
    }
  } catch (error: any) {
    if (error.response) {
      resMessage.value = error.response.data.message
    }
  }
}

const handleUpdateLayout = () => {
  alert('update seat layout')

  router.push({ name: 'CreateSeatLayout', params: { id: screenId.value } })
}

onMounted(() => {
  if (screenId.value) handleFetchSeatLayout(screenId.value)
})

// group seats
const groupedSeats = computed<Record<string, Seat[]>>(() => {
  const acc: Record<string, Seat[]> = {}
  seats.value.forEach((s) => {
    if (!acc[s.row]) acc[s.row] = []
    acc[s.row].push(s)
  })
  Object.values(acc).forEach((arr) => arr.sort((a, b) => a.seatNumber - b.seatNumber))
  return acc
})

// rows sorted for display
const rowsArray = computed(() => {
  const keys = Object.keys(groupedSeats.value)
  keys.sort((a, b) => b.localeCompare(a)) // O -> A
  return keys.map((k) => ({ row: k, seats: groupedSeats.value[k] }))
})

// seat class styling
const seatClass = (seat: Seat) => {
  if (seat.isBooked) return 'bg-red-600 text-white cursor-not-allowed border-red-600'
  if (!seat.isAvailable) return 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
  if (seat.type === 'regular') return 'bg-white border-gray-300'
  if (seat.type === 'premium') return 'bg-blue-100 border-blue-500'
  if (seat.type === 'vip') return 'bg-yellow-50 border-yellow-500'
  return 'bg-gray-100'
}
</script>

<style scoped>
.seat-block {
  height: 40px;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.seat-block:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}
</style>
