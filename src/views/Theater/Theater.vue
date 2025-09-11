<template>
  <div class="max-w-6xl mx-auto p-6 space-y-8">
    <!-- Toast & Confirm Dialog -->
    <Toast />
    <ConfirmDialog />

    <div class="bg-orange-200">{{ editedTheaterId }}</div>

    <!-- Top Bar -->
    <div class="flex justify-end">
      <Button
        label="Add New Theater"
        icon="pi pi-plus"
        severity="success"
        @click="visible = true"
      />
    </div>

    <!-- Theater Cards -->
    <div v-for="theater in theaters" :key="theater._id">
      <Card
        class="rounded-2xl overflow-hidden shadow-lg bg-white/80 backdrop-blur-md border border-gray-200 hover:shadow-2xl transition duration-300"
      >
        <!-- Title -->
        <template #title>
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold text-gray-800 tracking-tight">
              {{ theater.name }}
            </h2>
            <Tag
              :value="theater.isActive ? 'Active' : 'Inactive'"
              :severity="theater.isActive ? 'success' : 'danger'"
              class="px-4 py-1 text-sm rounded-full"
            />
          </div>
        </template>

        <!-- Content -->
        <template #content>
          <div class="grid md:grid-cols-2 gap-6 items-center">
            <!-- Theater Image -->
            <div class="relative group">
              <img
                :src="theater.image"
                alt="Theater"
                class="w-full h-72 object-cover rounded-xl shadow-md transform transition duration-300 group-hover:scale-105"
              />
              <!-- Overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition"
              ></div>
            </div>

            <!-- Theater Info -->
            <div class="space-y-4 text-gray-700">
              <p class="bg-green-200">{{ theater._id }}</p>
              <p class="flex items-center gap-2 text-base">
                <i class="pi pi-map-marker text-gray-500"></i>
                <span class="font-semibold text-gray-900">Location:</span>
                {{ theater.location }}
              </p>
              <p class="flex items-center gap-2 text-base">
                <i class="pi pi-building text-gray-500"></i>
                <span class="font-semibold text-gray-900">City:</span>
                {{ theater.city?.name || 'N/A' }},
                {{ theater.city?.state || 'N/A' }}
              </p>
              <p class="flex items-center gap-2 text-base">
                <i class="pi pi-video text-gray-500"></i>
                <span class="font-semibold text-gray-900">Screens:</span>
                {{ theater.no_of_screens }}
              </p>
              <p class="flex items-center gap-2 text-base">
                <i class="pi pi-calendar text-gray-500"></i>
                <span class="font-semibold text-gray-900">Created:</span>
                {{ new Date(theater.createdAt).toLocaleDateString() }}
              </p>
            </div>
          </div>
        </template>

        <!-- Footer -->
        <template #footer>
          <div class="flex flex-wrap gap-3 justify-end mt-2">
            <!-- New View Details -->
            <Button
              label="View Details"
              icon="pi pi-eye"
              severity="secondary"
              rounded
              outlined
              class="!px-4 !py-2"
              @click="viewTheaterDetails(theater)"
            />
            <Button
              label="Edit"
              icon="pi pi-pencil"
              severity="info"
              rounded
              outlined
              class="!px-4 !py-2"
              @click="editTheater(theater)"
            />
            <Button
              :label="theater.isActive ? 'Deactivate' : 'Activate'"
              :icon="theater.isActive ? 'pi pi-times-circle' : 'pi pi-check-circle'"
              :severity="theater.isActive ? 'warning' : 'success'"
              rounded
              class="!px-4 !py-2"
              @click="toggleStatus(theater)"
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              severity="danger"
              rounded
              text
              class="!px-4 !py-2"
              @click="deleteTheater(theater)"
            />
          </div>
        </template>
      </Card>
    </div>

    <Dialog
      v-model:visible="visible"
      modal
      header="Add New Theater"
      :style="{ width: '600px' }"
      class="rounded-2xl"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Theater Name -->
        <div class="space-y-2">
          <label class="text-gray-700 font-medium">Theater Name</label>
          <InputText v-model="form.name" placeholder="Enter theater name" class="w-full" />
          {{ form.name }}
        </div>

        <!-- Location -->
        <div class="space-y-2">
          <label class="text-gray-700 font-medium">Location</label>
          <InputText v-model="form.location" placeholder="Enter location" class="w-full" />
          {{ form.location }}
        </div>

        <!-- City Dropdown -->
        <div class="space-y-2">
          <label class="text-gray-700 font-medium">City</label>
          <Dropdown
            v-model="form.city"
            :options="cities"
            optionLabel="name"
            optionValue="_id"
            placeholder="Select a city"
            class="w-full"
          />
          {{ form.city }}
        </div>

        <!-- No of Screens -->
        <div class="space-y-2">
          <label class="text-gray-700 font-medium">No of Screens</label>
          <InputNumber
            v-model="form.no_of_screens"
            :min="1"
            placeholder="Enter number of screens"
            class="w-full"
          />
          {{ form.no_of_screens }}
        </div>

        <!-- Image Upload -->
        <div class="space-y-2">
          <label class="text-gray-700 font-medium">Upload Image</label>
          <FileUpload
            mode="basic"
            accept="image/*"
            auto
            chooseLabel="Select Image"
            @select="onImageSelect"
            class="w-full"
          />
          {{ form.image }}
        </div>

        <!-- Preview -->
        <div v-if="form.preview" class="mt-4">
          <img
            :src="form.preview"
            alt="Theater Preview"
            class="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-4 pt-4">
          <Button label="Cancel" severity="secondary" outlined @click="closeDialog" />
          <Button label="Add Theater" icon="pi pi-plus" severity="success" type="submit" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import {
  Button,
  Card,
  Dialog,
  Dropdown,
  FileUpload,
  InputNumber,
  InputText,
  Tag,
  Toast,
} from 'primevue'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import { onMounted, ref } from 'vue'
import { userAuthStore } from '@/stores/userAuthStore'
import { addtheater, fetchCities, fetchtheaterList, updatetheater } from '@/services/useApiServices'
import { useConfirm } from 'primevue/useconfirm'
import router from '@/router'

const confirm = useConfirm()
const store = userAuthStore()
const toast = useToast()

interface City {
  _id: string
  name: string
  state: string
}

interface theater {
  _id: string
  name: string
  location: string
  city?: City
  no_of_screens: number
  image: string
  isActive: boolean
  createdAt: string
  isRemoved?: boolean
  updatedAt?: string
  __v?: number
  ownerId?: any
}

const theaters = ref<theater[]>([])

const viewTheaterDetails = (theater: theater) => {
  toast.add({
    severity: 'info',
    summary: 'View Details',
    detail: `Viewing ${theater.name}`,
    life: 3000,
  })
}

const form = ref({
  name: '',
  location: '',
  city: '',
  no_of_screens: 0,
  image: '',
  preview: '',
})

const editedTheaterId = ref('')

const onImageSelect = (event: any) => {
  const file = event.files[0]
  if (file) {
    form.value.preview = URL.createObjectURL(file)
    form.value.image = file
  }
}

const editTheater = (theater: theater) => {
  editedTheaterId.value = theater._id
  form.value.name = theater.name
  form.value.location = theater.location
  form.value.city = theater.city?._id as string
  form.value.no_of_screens = theater.no_of_screens
  form.value.image = theater.image
  form.value.preview = theater.image
  visible.value = true
  console.log('🟢🟢', theater)
}

const fetchListOfCities = async () => {
  try {
    const res = await fetchCities()
    if (res.data.success) {
      cities.value = res.data.data
    }
  } catch (error) {
    console.log(error)
  }
}

const deleteTheater = (theater: theater) => {
  confirm.require({
    message: `Are you sure you want to delete ${theater.name}?`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      toast.add({
        severity: 'warn',
        summary: 'Deleted',
        detail: `${theater.name} deleted`,
        life: 3000,
      })
    },
  })
}

const toggleStatus = (theater: theater) => {
  theater.isActive = !theater.isActive
  toast.add({
    severity: theater.isActive ? 'success' : 'error',
    summary: 'Status Updated',
    detail: theater.isActive ? `${theater.name} Activated` : `${theater.name} Deactivated`,
    life: 3000,
  })
}

// ----- functionality for dialog -----

const visible = ref(false)
const cities = ref<City[]>([])

const handleSubmit = async () => {
  alert('dialog is work .....')

  try {
    const formdata = new FormData()

    formdata.append('name', form.value.name)
    formdata.append('location', form.value.location)
    formdata.append('city', form.value.city)
    formdata.append('no_of_screens', String(form.value.no_of_screens))
    formdata.append('image', form.value.image)

    if (editedTheaterId.value) {
      alert('edit mode')

      const res = await updatetheater(editedTheaterId.value, formdata)
      if (res.data.success) {
        alert(res.data.message)
        resetForm()
        closeDialog()
        handleFetchTheaterList()
      }
    } else {
      const res = await addtheater(formdata)

      if (res.data.success) {
        alert(res.data.message)
        resetForm()
        closeDialog()
        handleFetchTheaterList()
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    location: '',
    city: '',
    no_of_screens: 0,
    image: '',
    preview: '',
  }
}

const closeDialog = () => {
  resetForm()
  visible.value = false
}

// --- Fetch Theaters ---
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

onMounted(() => {
  handleFetchTheaterList()
  fetchListOfCities()
})
</script>
