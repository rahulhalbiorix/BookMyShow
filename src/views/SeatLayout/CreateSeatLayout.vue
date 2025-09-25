<template>
  <div class="max-w-3xl mx-auto p-6">
    <!-- Title -->
    <h1 class="text-2xl font-bold mb-6 text-center">Create Seat Layout</h1>

    <!-- Rows -->
    <div class="flex items-center gap-4 mb-4">
      <label for="rows" class="font-semibold w-32">Rows</label>
      <InputNumber
        id="rows"
        v-model="form.rows"
        class="flex-auto"
        :min="1"
        @update:modelValue="validateRowsCols"
      />
    </div>

    <!-- Columns -->
    <div class="flex items-center gap-4 mb-4">
      <label for="cols" class="font-semibold w-32">Columns</label>
      <InputNumber
        id="cols"
        v-model="form.cols"
        class="flex-auto"
        :min="1"
        @update:modelValue="validateRowsCols"
      />
    </div>

    <!-- Validation Message -->
    <p v-if="validationError" class="text-red-500 text-sm mb-4">
      {{ validationError }}
    </p>

    <!-- Default Price -->
    <div class="flex items-center gap-4 mb-6">
      <label for="defaultPrice" class="font-semibold w-32">Default Price</label>
      <InputNumber
        id="defaultPrice"
        v-model="form.defaultRegularPrice"
        class="flex-auto"
        :min="0"
      />
    </div>

    <!-- Special Seat Overrides -->
    <h3 class="font-semibold text-lg mb-2">Special Seat Overrides</h3>
    <div v-for="(seat, index) in form.seats" :key="index" class="flex items-center gap-3 mb-3">
      <InputNumber v-model="seat.row" :min="1" placeholder="Row" class="w-20" />
      <Dropdown v-model="seat.type" :options="seatTypes" placeholder="Type" class="w-32" />
      <InputNumber v-model="seat.price" :min="0" placeholder="Price" class="w-28" />
      <Button icon="pi pi-trash" severity="danger" text @click="removeSeat(index)" />
    </div>

    <!-- Add Seat Button -->
    <Button icon="pi pi-plus" label="Add Seat Override" text @click="addSeat" class="mb-6" />

    <!-- Footer -->
    <div class="flex justify-end gap-2">
      <Button
        :label="submitBtn"
        icon="pi pi-check"
        :loading="isSaving"
        :disabled="!!validationError || isSaving"
        @click="handleSave"
      />
    </div>
  </div>

  <!-- Debug Info (Remove in production) -->
  <div class="mt-4 space-y-2">
    <div class="bg-red-200">Screen id: {{ screenId }}</div>
    <div class="bg-green-200">Theater Id: {{ theaterId }}</div>
    <div class="bg-pink-200">Total Seats: {{ TotalSeats }}</div>
    <div class="bg-yellow-200">Rows × Cols = {{ form.rows * form.cols }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { Button, Dropdown, InputNumber } from 'primevue'
import {
  createSeatLayout,
  fetchScreenDetails,
  fetchseatLayout,
  updateSeatLayout,
} from '@/services/useApiServices'

/* -------------------------------------------------------------------------- */
/*                                   State                                    */
/* -------------------------------------------------------------------------- */
const form = ref({
  rows: 5,
  cols: 10,
  defaultRegularPrice: 120,
  seats: [
    { row: 2, type: 'vip', price: 300 },
    { row: 3, type: 'premium', price: 200 },
  ],
})

const seatTypes = ['vip', 'premium', 'regular']
const screenId = ref('')
const theaterId = ref('')
const TotalSeats = ref(0)
const editedSeatLayoutId = ref('')
const validationError = ref<string | null>(null)
const isSaving = ref(false)

/* -------------------------------------------------------------------------- */
/*                                 Computed                                   */
/* -------------------------------------------------------------------------- */
const submitBtn = computed(() =>
  editedSeatLayoutId.value ? 'Edit Seat Layout' : 'Add Seat Layout',
)

/* -------------------------------------------------------------------------- */
/*                                 Watchers                                   */
/* -------------------------------------------------------------------------- */
watch(editedSeatLayoutId, (newVal) => {
  if (newVal) handleFetchSeatLayout(screenId.value)
})

/* -------------------------------------------------------------------------- */
/*                                 Methods                                    */
/* -------------------------------------------------------------------------- */
const addSeat = () => form.value.seats.push({ row: null, type: null, price: null })
const removeSeat = (index: number) => form.value.seats.splice(index, 1)

const validateRowsCols = () => {
  const totalSelected = form.value.rows * form.value.cols
  validationError.value =
    totalSelected > TotalSeats.value
      ? `Total selected seats (${totalSelected}) cannot exceed total seats (${TotalSeats.value}).`
      : null
}

const handleSave = async () => {
  validateRowsCols()
  if (validationError.value) return

  isSaving.value = true
  try {
    const payload = {
      screenId: screenId.value,
      theaterId: theaterId.value,
      rows: form.value.rows,
      cols: form.value.cols,
      defaultRegularPrice: form.value.defaultRegularPrice,
      seats: form.value.seats,
    }

    let res
    if (editedSeatLayoutId.value) {
      res = await updateSeatLayout(editedSeatLayoutId.value, payload)
    } else {
      res = await createSeatLayout(payload)
    }

    if (res.data.success) {
      router.push({ name: 'AdminSeatLayout', params: { id: screenId.value } })
    }
  } catch (err) {
    console.error(err)
  } finally {
    isSaving.value = false
  }
}

const handleFetchScreenDetails = async (id: string) => {
  try {
    const res = await fetchScreenDetails(id)
    if (!res.data.success) return

    const data = res.data.data
    screenId.value = data._id
    theaterId.value = data.theaterId._id
    editedSeatLayoutId.value = data.seatLayoutId

    // Set TotalSeats correctly
    TotalSeats.value = data.seatLayoutId
      ? data.seatLayout.rows * data.seatLayout.cols
      : data.totalSeats
  } catch (err) {
    console.error(err)
  }
}

const handleFetchSeatLayout = async (id: string) => {
  try {
    const res = await fetchseatLayout(id)
    if (!res.data?.success) return

    const seatLayout = res.data.data.seatLayout
    form.value.rows = seatLayout.rows
    form.value.cols = seatLayout.cols
    form.value.defaultRegularPrice = seatLayout.defaultRegularPrice
    TotalSeats.value = seatLayout.rows * seatLayout.cols

    form.value.seats = Object.values(res.data.data.seatTypes).map((seatType: any) => ({
      row: seatType.rowCount,
      price: seatType.price,
      type: seatType.type,
    }))
  } catch (err) {
    console.error(err)
  }
}

/* -------------------------------------------------------------------------- */
/*                                 Lifecycle                                  */
/* -------------------------------------------------------------------------- */
const route = useRoute()
screenId.value = route.params.id as string

onMounted(() => handleFetchScreenDetails(screenId.value))
</script>
