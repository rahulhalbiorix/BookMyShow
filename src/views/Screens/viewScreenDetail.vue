<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Screen Info Card -->
    <Card class="shadow-lg rounded-xl">
      <template #title>
        {{ data.name }}
      </template>
      <template #subtitle> {{ data.theaterId?.name }} - {{ data.theaterId?.location }} </template>
      <template #content>
        <div class="space-y-2">
          <p><b>Total Seats:</b> {{ data.totalSeats }}</p>
          <p><b>Seat Layout ID:</b> {{ data.seatLayoutId }}</p>
          <p>
            <b>Status:</b>
            <Tag
              :value="data.isActive ? 'Active' : 'Inactive'"
              :severity="data.isActive ? 'success' : 'danger'"
            />
          </p>
          <p>
            <b>Completed:</b>
            <Tag
              :value="data.isComplete ? 'Yes' : 'No'"
              :severity="data.isComplete ? 'success' : 'warn'"
            />
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <Button
            v-if="SeatLayOutId"
            label="View Seat Layout"
            icon="pi pi-th-large"
            severity="info"
            @click="handleViewSeatLayout"
          />

          <Button
            v-else
            label="Create Seat Layout"
            icon="pi pi-plus"
            severity="success"
            @click="handleCreateSeatLayout"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { fetchScreenDetails } from '@/services/useApiServices'
import { Button, Card, Tag } from 'primevue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const ScreenId = ref('')
const data = ref<any>({})

const route = useRoute()
const router = useRouter()

const SeatLayOutId = ref('')

ScreenId.value = route.params.id as string

const handleFetchScreenDetails = async (id: string) => {
  try {
    const res = await fetchScreenDetails(id)
    if (res.data.success) {
      data.value = res.data.data
      ScreenId.value = res.data.data._id
      SeatLayOutId.value = res.data.data?.seatLayoutId
    }
  } catch (error) {
    console.log(error)
  }
}

const handleViewSeatLayout = () => {
  router.push({ name: 'AdminSeatLayout', params: { id: ScreenId.value } })

  alert('start to view  seat layout....')
}

const handleCreateSeatLayout = () => {
  router.push({ name: 'CreateSeatLayout', params: { id: ScreenId.value } })
}

onMounted(() => {
  handleFetchScreenDetails(ScreenId.value)
})
</script>
