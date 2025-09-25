<template>
  <div class="max-w-5xl mx-auto p-6">
    <!-- Title -->
    <h1 class="text-3xl font-bold mb-8 text-gray-800 text-center">🎟️ My Bookings</h1>

    <!-- Empty State -->
    <div v-if="bookings.length === 0" class="text-center text-gray-500">No bookings found.</div>

    <!-- Booking Card -->
    <div
      v-for="booking in bookings"
      :key="booking._id"
      class="bg-white border rounded-xl shadow-md p-5 mb-6 hover:shadow-lg transition"
    >
      <!-- Top Row: Theater + Date -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">
            {{ booking.theater.name }}
          </h2>
          <p class="text-gray-500 text-sm">{{ booking.theater.location }}</p>
        </div>
        <span class="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
          {{ formatDate(booking.bookedAt) }}
        </span>
      </div>

      <!-- Screen Info -->
      <p class="mb-2 text-gray-700">
        <strong class="text-gray-800">Screen:</strong> {{ booking.screen.name }}
      </p>

      <!-- Seats -->
      <div class="mt-3">
        <p class="font-semibold text-gray-800 mb-1">Seats:</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="seat in booking.seatDetails.seats"
            :key="seat._id"
            class="inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full"
          >
            Row {{ seat.row }} - Seat {{ seat.seatNumber }}
          </span>
        </div>
      </div>

      <!-- Amount + User Info -->
      <div class="mt-4 flex items-center justify-between border-t pt-3">
        <p class="font-semibold text-gray-800">💰 ₹{{ booking.totalAmount }}</p>
        <p class="text-sm text-gray-500">
          Booked by: <span class="font-medium">{{ booking.user.name }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchUserBookingHistory } from '@/services/useApiServices'
import { onMounted, ref } from 'vue'

/* -----------------------
   Types for Booking Data
------------------------ */
interface Seat {
  _id: string
  row: string
  seatNumber: number
  type: string
  price: number
  isBooked: boolean
  isAvailable: boolean
}

interface SeatDetails {
  seats: Seat[]
}

interface User {
  _id: string
  name: string
  email: string
  mobile: string
}

interface Theater {
  _id: string
  name: string
  location: string
}

interface Screen {
  _id: string
  name: string
}

interface Booking {
  _id: string
  user: User
  theater: Theater
  screen: Screen
  seatDetails: SeatDetails
  totalAmount: number
  bookedAt: string
}

/* -----------------------
   State
------------------------ */
const bookings = ref<Booking[]>([])

/* -----------------------
   Helpers
------------------------ */
function formatDate(date: string): string {
  const d = new Date(date)
  return d.toLocaleString()
}

/* -----------------------
   API Call
------------------------ */
const handleFetchBookingHistory = async () => {
  try {
    const res = await fetchUserBookingHistory()

    if (res.data.success) {
      alert(res.data.message)
      bookings.value = res.data.data[0].bookings as Booking[]
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  handleFetchBookingHistory()
})
</script>
