<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">Book Seats</h1>

    <!-- Rows -->
    <div v-if="rowsArray.length" class="border p-4 rounded-lg shadow">
      <div v-for="rowObj in rowsArray" :key="rowObj.row" class="mb-6">
        <div class="flex justify-between items-center mb-2 px-4">
          <h2 class="font-semibold text-lg">Row {{ rowObj.row }}</h2>
          <span class="text-sm text-gray-600">
            ₹ {{ rowObj.seats[0]?.price ?? '-' }} • {{ rowObj.seats[0]?.type ?? '-' }}
          </span>
        </div>

        <div class="grid grid-cols-10 gap-2 justify-center px-4">
          <div
            v-for="seat in rowObj.seats"
            :key="seat._id"
            class="seat-block flex items-center justify-center rounded-md text-sm font-medium border select-none"
            :class="[seatClass(seat), isSelected(seat) ? 'ring-2 ring-red-500 scale-105' : '']"
            @click="handleSeatClick(seat)"
          >
            {{ seat.seatNumber }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-red-500 font-semibold">{{ resMessage }}</div>

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
      <div class="flex items-center gap-2">
        <span class="w-4 h-4 rounded-sm bg-green-300 border border-green-600"></span> Selected
      </div>
    </div>

    <!-- Selected seats + total price -->
    <div v-if="selectedSeats.length" class="mt-8 text-center">
      <p class="font-semibold">
        Selected Seats: {{ selectedSeats.map((s) => s.row + s.seatNumber).join(', ') }}
      </p>
      <p class="mt-1">Total: ₹ {{ totalPrice }}</p>
      <Button
        label="Proceed to Payment"
        severity="danger"
        class="mt-3"
        @click="handleSeatPayment()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { BookSeatsOnShow, fetchseatLayout } from '@/services/useApiServices'
import { Button } from 'primevue'

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
const showId = route.query.showId as string
const selectedSeats = ref<Seat[]>([])

const handleFetchSeatLayout = async (id: string) => {
  try {
    const res = await fetchseatLayout(id)
    if (res.data?.success) {
      seats.value = res.data.data.seatLayout.seats
    }
  } catch (error: any) {
    resMessage.value = error.response?.data?.message || 'Error fetching seat layout'
  }
}

onMounted(() => {
  if (screenId.value) handleFetchSeatLayout(screenId.value)
})

const groupedSeats = computed<Record<string, Seat[]>>(() => {
  const acc: Record<string, Seat[]> = {}
  seats.value.forEach((s) => {
    if (!acc[s.row]) acc[s.row] = []
    acc[s.row].push(s)
  })
  Object.values(acc).forEach((arr) => arr.sort((a, b) => a.seatNumber - b.seatNumber))
  return acc
})

const rowsArray = computed(() => {
  const keys = Object.keys(groupedSeats.value)
  keys.sort((a, b) => b.localeCompare(a))
  return keys.map((k) => ({ row: k, seats: groupedSeats.value[k] }))
})

const seatClass = (seat: Seat) => {
  if (seat.isBooked) return 'bg-red-600 text-white cursor-not-allowed border-red-600'
  if (!seat.isAvailable) return 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
  if (seat.type === 'regular') return 'bg-white border-gray-300'
  if (seat.type === 'premium') return 'bg-blue-100 border-blue-500'
  if (seat.type === 'vip') return 'bg-yellow-50 border-yellow-500'
  return 'bg-gray-100'
}

const handleSeatClick = (seat: Seat) => {
  if (seat.isBooked || !seat.isAvailable) return
  const index = selectedSeats.value.findIndex((s) => s._id === seat._id)
  if (index > -1) {
    selectedSeats.value.splice(index, 1)
  } else {
    selectedSeats.value.push(seat)
  }
}

const isSelected = (seat: Seat) => selectedSeats.value.some((s) => s._id === seat._id)

const totalPrice = computed(() => selectedSeats.value.reduce((sum, seat) => sum + seat.price, 0))

const handleSeatPayment = async () => {
  try {
    const Payload = {
      seatIds: selectedSeats.value.map((item) => item._id),
      showId: showId,
    }
    const res = await BookSeatsOnShow(Payload)
    if (res.data.success) {
      alert(res.data.message)
      selectedSeats.value = []
      handleFetchSeatLayout(screenId.value)
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
