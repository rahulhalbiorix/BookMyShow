<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">Create Seat Layout</h1>
    <div class="bg-orange-200">Edit Seat LayOut Id : {{ editedSeatLayoutId }}</div>
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
      <Button :label="submitBtn" @click="handleSave" :disabled="!!validationError" />
    </div>
  </div>

  <!-- for testing purpose  -->
  <div>
    <div class="bg-red-200">Screen id : {{ screenId }}</div>
    <div class="bg-green-200">Theater Id : {{ theaterId }}</div>
    <div class="bg-pink-200">Total Seats : {{ TotalSeats }}</div>
    <div class="bg-yellow-200">Rows × Cols = {{ form.rows * form.cols }}</div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import {
  createSeatLayout,
  fetchScreenDetails,
  fetchseatLayout,
  updateSeatLayout,
} from '@/services/useApiServices'
import { Button, Dropdown, InputNumber } from 'primevue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

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

const submitBtn = computed(() => {
  if (editedSeatLayoutId.value) {
    return 'Edit Seat Layout'
  } else {
    return 'Add seat Layout'
  }
})

watch(editedSeatLayoutId, (newVal) => {
  if (newVal) {
    handleFetchSeatLayout(screenId.value)
  }
})

const validationError = ref<string | null>(null)

const route = useRoute()
screenId.value = route.params.id as string

const addSeat = () => {
  form.value.seats.push({ row: null, type: null, price: null })
}

const removeSeat = (index: number) => {
  form.value.seats.splice(index, 1)
}

const validateRowsCols = () => {
  const totalSelected = form.value.rows * form.value.cols
  if (totalSelected > TotalSeats.value) {
    validationError.value = `Total selected seats (${totalSelected}) cannot exceed total seats (${TotalSeats.value}).`
  } else {
    validationError.value = null
  }
}

const handleSave = async () => {
  validateRowsCols()
  if (validationError.value) {
    return
  }

  try {
    const payload = {
      screenId: screenId.value,
      theaterId: theaterId.value,
      rows: form.value.rows,
      cols: form.value.cols,
      defaultRegularPrice: form.value.defaultRegularPrice,
      seats: form.value.seats,
    }

    if (editedSeatLayoutId.value) {
      alert('Edit mode')
      const res = await updateSeatLayout(editedSeatLayoutId.value, payload)

      if (res.data.success) {
        alert(res.data.success)
        router.push({ name: 'ViewSeatLayout', params: { id: screenId.value } })
      }
    } else {
      const res = await createSeatLayout(payload)

      if (res.data.success) {
        alert(res.data.success)
        router.push({ name: 'ViewSeatLayout', params: { id: screenId.value } })
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const handleFetchScreenDetails = async (id: string) => {
  try {
    const res = await fetchScreenDetails(id)
    if (res.data.success) {
      console.log(res.data)
      screenId.value = res.data.data._id
      theaterId.value = res.data.data.theaterId._id

      editedSeatLayoutId.value = res.data.data.seatLayoutId

      if (!res.data.data.seatLayoutId) {
        TotalSeats.value = res.data.data.totalSeats
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const handleFetchSeatLayout = async (id: string) => {
  try {
    const res = await fetchseatLayout(id)
    if (res.data?.success) {
      alert(res.data.message)
      console.log('fetch Seat layout ', res.data)
      form.value.rows = res.data.data.seatLayout.rows
      form.value.cols = res.data.data.seatLayout.cols
      form.value.defaultRegularPrice = res.data.data.seatLayout.defaultRegularPrice

      form.value.seats = Object.values(res.data.data.seatTypes).map((seatType: any) => ({
        row: seatType.rowCount,
        price: seatType.price,
        type: seatType.type,
      }))
    }
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  handleFetchScreenDetails(screenId.value)
})
</script>
