<template>
  <div class="max-w-6xl mx-auto p-6 space-y-8">
    <!-- Toast & Confirm Dialog -->
    <Toast />
    <ConfirmDialog />

    <!-- Top Bar -->
    <div class="flex justify-end">
      <Button
        label="Add New Theater"
        icon="pi pi-plus"
        severity="success"
        @click="visible = true"
      />
    </div>

    <!-- Loader while fetching -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <i class="pi pi-spin pi-spinner text-4xl text-gray-600"></i>
    </div>

    <!-- Theater Cards -->
    <div v-else>
      <div v-if="theaters.length > 0" class="grid gap-6">
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
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition"
                  ></div>
                </div>

                <!-- Theater Info -->
                <div class="space-y-4 text-gray-700">
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
                <Button
                  label="View Details"
                  icon="pi pi-eye"
                  severity="secondary"
                  rounded
                  outlined
                  class="!px-4 !py-2"
                  @click="viewTheaterDetails(theater._id)"
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
                  @click="deleteTheater(theater._id)"
                />
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- No Data -->
      <div v-else class="text-center py-12 text-gray-500">
        <i class="pi pi-info-circle text-2xl mb-2"></i>
        <p>No theaters found.</p>
      </div>
    </div>

    <!-- Dialog -->
    <Dialog
      v-model:visible="visible"
      modal
      header="Add / Edit Theater"
      :style="{ width: '600px' }"
      class="rounded-2xl"
      @hide="closeDialog"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Theater Name -->
        <div class="space-y-2">
          <label class="text-gray-700 font-medium">Theater Name</label>
          <InputText
            v-model="form.name"
            placeholder="Enter theater name"
            class="w-full"
            :class="{ 'p-invalid': errors.name }"
          />
          <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
        </div>

        <!-- Location -->
        <div class="space-y-2">
          <label class="text-gray-700 font-medium">Location</label>
          <InputText
            v-model="form.location"
            placeholder="Enter location"
            class="w-full"
            :class="{ 'p-invalid': errors.location }"
          />
          <small v-if="errors.location" class="text-red-500">{{ errors.location }}</small>
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
            :class="{ 'p-invalid': errors.city }"
          />
          <small v-if="errors.city" class="text-red-500">{{ errors.city }}</small>
        </div>

        <!-- No of Screens -->
        <div class="space-y-2">
          <label class="text-gray-700 font-medium">No of Screens</label>
          <InputNumber
            v-model="form.no_of_screens"
            :min="1"
            placeholder="Enter number of screens"
            class="w-full"
            :class="{ 'p-invalid': errors.no_of_screens }"
          />
          <small v-if="errors.no_of_screens" class="text-red-500">{{ errors.no_of_screens }}</small>
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
            :class="{ 'p-invalid': errors.image }"
          />
          <small v-if="errors.image" class="text-red-500">{{ errors.image }}</small>
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
          <Button
            :label="editedTheaterId ? 'Update Theater' : 'Add Theater'"
            :icon="editedTheaterId ? 'pi pi-pencil' : 'pi pi-plus'"
            severity="success"
            type="submit"
            :loading="loadingBtn"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
/* ---------------- Imports ---------------- */
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
import { useConfirm } from 'primevue/useconfirm'
import router from '@/router'
import { userAuthStore } from '@/stores/userAuthStore'
import {
  addtheater,
  fetchCities,
  fetchtheaterList,
  updatetheater,
  deletetheater,
  activateDeactivatetheater,
} from '@/services/useApiServices'

/* ---------------- Types ---------------- */
interface City {
  _id: string
  name: string
  state: string
}

interface Theater {
  _id: string
  name: string
  location: string
  city?: City
  no_of_screens: number
  image: string
  isActive: boolean
  createdAt: string
}

/* ---------------- State ---------------- */
const theaters = ref<Theater[]>([])
const cities = ref<City[]>([])
const form = ref({
  name: '',
  location: '',
  city: '',
  no_of_screens: 0,
  image: '',
  preview: '',
})
const editedTheaterId = ref('')
const visible = ref(false)
const loading = ref(false)
const loadingBtn = ref(false)

const store = userAuthStore()
const toast = useToast()
const confirm = useConfirm()

const errors = ref<{ [key: string]: string }>({})

/* ---------------- Validation ---------------- */
const validateForm = () => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Theater name is required'
  }
  if (!form.value.location.trim()) {
    errors.value.location = 'Location is required'
  }
  if (!form.value.city) {
    errors.value.city = 'Please select a city'
  }
  if (!form.value.no_of_screens || form.value.no_of_screens < 1) {
    errors.value.no_of_screens = 'Number of screens must be at least 1'
  }
  if (!editedTheaterId.value && !form.value.image) {
    errors.value.image = 'Please upload an image'
  }

  return Object.keys(errors.value).length === 0
}

/* ---------------- Handlers ---------------- */
const viewTheaterDetails = (id: string) => {
  router.push({ name: 'TheaterDetailes', params: { id } })
}

const onImageSelect = (event: any) => {
  const file = event.files[0]
  if (file) {
    form.value.preview = URL.createObjectURL(file)
    form.value.image = file
  }
}

const editTheater = (theater: Theater) => {
  editedTheaterId.value = theater._id
  form.value = {
    name: theater.name,
    location: theater.location,
    city: theater.city?._id as string,
    no_of_screens: theater.no_of_screens,
    image: theater.image,
    preview: theater.image,
  }
  visible.value = true
}

const deleteTheater = (id: string) => {
  confirm.require({
    message: 'Are you sure you want to delete this theater?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        const res = await deletetheater(id)
        if (res.data.success) {
          toast.add({ severity: 'warn', summary: 'Deleted', detail: res.data.message, life: 3000 })
          handleFetchTheaterList()
        }
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete theater',
          life: 3000,
        })
        console.error(error)
      }
    },
  })
}

const toggleStatus = async (theater: Theater) => {
  try {
    const res = await activateDeactivatetheater(theater._id)
    if (res.data.success) {
      const isActiveNow = res.data.data.isActive
      toast.add({
        severity: isActiveNow ? 'success' : 'error',
        summary: 'Status Updated',
        detail: res.data.message,
        life: 3000,
      })
      handleFetchTheaterList()
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update status',
      life: 3000,
    })
  }
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loadingBtn.value = true
  try {
    const formdata = new FormData()
    formdata.append('name', form.value.name)
    formdata.append('location', form.value.location)
    formdata.append('city', form.value.city)
    formdata.append('no_of_screens', String(form.value.no_of_screens))
    formdata.append('image', form.value.image)

    const res = editedTheaterId.value
      ? await updatetheater(editedTheaterId.value, formdata)
      : await addtheater(formdata)

    if (res.data.success) {
      toast.add({ severity: 'success', summary: 'Success', detail: res.data.message, life: 3000 })
      closeDialog()
      handleFetchTheaterList()
    }
  } catch (error) {
    console.error(error)
  } finally {
    loadingBtn.value = false
  }
}

const resetForm = () => {
  form.value = { name: '', location: '', city: '', no_of_screens: 0, image: '', preview: '' }
}

const closeDialog = () => {
  resetForm()
  editedTheaterId.value = ''
  visible.value = false
}

const fetchListOfCities = async () => {
  try {
    const res = await fetchCities()
    if (res.data.success) {
      cities.value = res.data.data
    }
  } catch (error) {
    console.error(error)
  }
}

const handleFetchTheaterList = async () => {
  loading.value = true
  try {
    const res = await fetchtheaterList(store.OwnerId, '')
    if (res.data.success) {
      theaters.value = res.data.data.theaters
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

/* ---------------- Lifecycle ---------------- */
onMounted(() => {
  handleFetchTheaterList()
  fetchListOfCities()
})
</script>
