<template>
  <div class="max-w-screen-lg mx-auto p-6 space-y-6">
    <!-- Toast & Confirm Dialog -->
    <Toast />
    <ConfirmDialog />

    <!-- Header Toolbar -->
    <Toolbar class="mb-4 shadow-md rounded-lg">
      <template #end>
        <Button
          label="Add New Screen"
          icon="pi pi-plus"
          severity="success"
          class="font-medium"
          @click="handleAddScreen"
        />
      </template>
    </Toolbar>

    <!-- Loading Spinner while fetching -->
    <div v-if="isListLoading" class="flex justify-center py-20">
      <i class="pi pi-spin pi-spinner text-4xl text-gray-500"></i>
    </div>

    <!-- Screen Cards Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="screen in screens"
        :key="screen._id"
        class="shadow-lg rounded-xl flex flex-col h-full"
      >
        <template #title>
          <div class="flex justify-between items-center">
            <span class="font-bold text-lg">{{ screen.name }}</span>
            <Tag
              :value="screen.isActive ? 'Active' : 'Inactive'"
              :severity="screen.isActive ? 'success' : 'danger'"
              class="px-3 py-1 text-sm"
            />
          </div>
        </template>

        <template #subtitle>
          <span class="text-gray-500">Total Seats: {{ screen.totalSeats }}</span>
        </template>

        <template #footer>
          <div class="flex flex-wrap">
            <Button
              label="View"
              icon="pi pi-eye"
              severity="info"
              outlined
              size="small"
              class="flex-1 min-w-[100px]"
              @click="handleScreenView(screen._id)"
            />
          </div>
          <div class="flex flex-wrap justify-between gap-2 mt-2">
            <Button
              label="Edit"
              icon="pi pi-pencil"
              severity="warning"
              outlined
              size="small"
              class="flex-1 min-w-[100px]"
              @click="handleEditScreen(screen)"
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              severity="danger"
              outlined
              size="small"
              class="flex-1 min-w-[100px]"
              @click="handleDeleteScreen(screen._id)"
            />
            <Button
              :label="screen.isActive ? 'Deactivate' : 'Activate'"
              :icon="screen.isActive ? 'pi pi-times' : 'pi pi-check'"
              :severity="screen.isActive ? 'secondary' : 'success'"
              outlined
              size="small"
              class="flex-1 min-w-[100px]"
              @click="handleToggleActive(screen._id)"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- ----dialog box for add/edit screen -->
    <Dialog
      v-model:visible="visible"
      modal
      :header="EditedScreenId ? 'Edit Screen' : 'Add New Screen'"
      :style="{ width: '400px' }"
      :closable="true"
      @hide="resetForm"
    >
      <div class="space-y-4">
        <!-- Screen Name -->
        <div>
          <label class="block text-sm font-medium mb-1">Screen Name</label>
          <InputText
            v-model="newScreen.name"
            placeholder="Enter screen name"
            class="w-full"
            :class="{ 'p-invalid': errors.name }"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <!-- Total Seats -->
        <div>
          <label class="block text-sm font-medium mb-1">Total Seats</label>
          <InputNumber
            v-model="newScreen.totalSeats"
            placeholder="Enter total seats"
            class="w-full"
            :class="{ 'p-invalid': errors.totalSeats }"
          />
          <small v-if="errors.totalSeats" class="p-error">{{ errors.totalSeats }}</small>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="resetForm" />
        <Button
          :label="EditedScreenId ? 'Update' : 'Save'"
          icon="pi pi-check"
          severity="success"
          :loading="isSaving"
          :disabled="isSaving"
          @click="handleSaveScreen"
        />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import {
  addScreen,
  deleteScreen,
  fetchScreenList,
  toggleScreen,
  updateScreen,
} from '@/services/useApiServices'
import { useRoute } from 'vue-router'
import {
  Button,
  Card,
  ConfirmDialog,
  Dialog,
  InputNumber,
  InputText,
  Tag,
  Toast,
  Toolbar,
  useConfirm,
  useToast,
} from 'primevue'
import router from '@/router'

interface Screen {
  _id: string
  name: string
  totalSeats: number
  isActive: boolean
}

const visible = ref(false)
const newScreen = ref({ name: '', totalSeats: 0 })
const TheaterId = ref('')
const EditedScreenId = ref('')
const screens = ref<Screen[]>([])

// Validation errors
const errors = ref<{ name?: string; totalSeats?: string }>({})

// Loading states
const isSaving = ref(false)
const isListLoading = ref(false)

const route = useRoute()
TheaterId.value = route.params.id as string

const toast = useToast()
const confirm = useConfirm()

const validateForm = () => {
  errors.value = {}
  if (!newScreen.value.name) {
    errors.value.name = 'Screen name is required'
  }
  if (!newScreen.value.totalSeats || newScreen.value.totalSeats <= 0) {
    errors.value.totalSeats = 'Total seats must be greater than 0'
  }
  return Object.keys(errors.value).length === 0
}

const handleAddScreen = () => {
  visible.value = true
}

const handleSaveScreen = async () => {
  if (!validateForm()) return

  isSaving.value = true
  try {
    if (EditedScreenId.value) {
      const updatePayload = {
        name: newScreen.value.name,
        totalSeats: newScreen.value.totalSeats,
      }
      const res = await updateScreen(EditedScreenId.value, updatePayload)
      if (res.data.success) {
        toast.add({
          severity: 'success',
          summary: 'Updated',
          detail: res.data.message,
          life: 3000,
        })
        EditedScreenId.value = ''
        handleFetchscreenList()
      }
    } else {
      const addPayload = {
        name: newScreen.value.name,
        totalSeats: newScreen.value.totalSeats,
        theaterId: TheaterId.value,
      }
      const res = await addScreen(addPayload)
      if (res.data.success) {
        toast.add({
          severity: 'success',
          summary: 'Added',
          detail: res.data.message,
          life: 3000,
        })
        handleFetchscreenList()
      }
    }
    resetForm()
  } catch (error) {
    console.log(error)
  } finally {
    isSaving.value = false
  }
}

const resetForm = () => {
  newScreen.value = { name: '', totalSeats: 0 }
  visible.value = false
  EditedScreenId.value = ''
  errors.value = {}
}

const handleEditScreen = (screen: Screen) => {
  EditedScreenId.value = screen._id
  newScreen.value.name = screen.name
  newScreen.value.totalSeats = screen.totalSeats
  visible.value = true
}

const handleDeleteScreen = (id: string) => {
  confirm.require({
    message: 'Are you sure you want to delete this screen?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        const res = await deleteScreen(id)
        if (res.data.success) {
          toast.add({
            severity: 'error',
            summary: 'Deleted',
            detail: res.data.message,
            life: 3000,
          })
          handleFetchscreenList()
        }
      } catch (error) {
        console.log(error)
      }
    },
  })
}

const handleToggleActive = async (id: string) => {
  try {
    const res = await toggleScreen(id)
    if (res.data.success) {
      toast.add({
        severity: res.data.isActive ? 'success' : 'secondary',
        summary: 'Status Changed',
        detail: `${res.data.data.name} is now ${res.data.isActive ? 'Active' : 'Inactive'}`,
        life: 3000,
      })
      handleFetchscreenList()
    }
  } catch (error) {
    console.log(error)
  }
}

const handleFetchscreenList = async () => {
  isListLoading.value = true
  try {
    const res = await fetchScreenList(TheaterId.value)
    if (res.data.success) {
      screens.value = res.data.data.screens
    }
  } catch (error) {
    console.log(error)
  } finally {
    isListLoading.value = false
  }
}

const handleScreenView = (id: string) => {
  router.push({ name: 'ViewScreen', params: { id } })
}

onMounted(() => {
  handleFetchscreenList()
})
</script>

<style>
.p-error {
  color: red;
}
</style>
