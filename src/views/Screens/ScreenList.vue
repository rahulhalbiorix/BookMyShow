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

    <div class="bg-red-200">
      {{ EditedScreenId }}
    </div>

    <!-- Screen Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="screen in screens"
        :key="screen._id"
        class="shadow-lg rounded-xl flex flex-col h-full"
      >
        <!-- Card Title -->
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

        <!-- Card Subtitle -->
        <template #subtitle>
          <span class="text-gray-500">Total Seats: {{ screen.totalSeats }}</span>
          <div class="bg-blue-100">
            {{ screen._id }}
          </div>
        </template>

        <!-- Card Footer with Actions -->
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
            ></Button>
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

    <!-- ----dialog box for add screen -->

    <Dialog
      v-model:visible="visible"
      modal
      header="Add New Screen"
      :style="{ width: '400px' }"
      :closable="true"
      @hide="resetForm"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Screen Name</label>
          <InputText v-model="newScreen.name" placeholder="Enter screen name" class="w-full" />
          {{ newScreen.name }}
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Total Seats</label>
          <InputNumber
            v-model="newScreen.totalSeats"
            placeholder="Enter total seats"
            class="w-full"
          />
          {{ newScreen.totalSeats }}
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="resetForm" />
        <Button label="Save" icon="pi pi-check" severity="success" @click="handleSaveScreen" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import {
  addScreen,
  deleteScreen,
  fetchScreenDetailes,
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

interface screens {
  _id: string
  name: string
  totalSeats: number
  isActive: boolean
}

const visible = ref(false)
const newScreen = ref({ name: '', totalSeats: 0 })

const TheaterId = ref('')
const EditedScreenId = ref('')

const screens = ref<screens[]>([])

const route = useRoute()
TheaterId.value = route.params.id as string

const toast = useToast()
const confirm = useConfirm()

const handleAddScreen = () => {
  console.log('add btn clicked....')
  visible.value = true
}

const handleSaveScreen = async () => {
  if (!newScreen.value.name || !newScreen.value.totalSeats) {
    toast.add({
      severity: 'warn',
      summary: 'Validation',
      detail: 'Please fill all fields',
      life: 3000,
    })
    return
  }

  try {
    if (EditedScreenId.value) {
      alert('Edit Mode')

      const updatePayload = {
        name: newScreen.value.name,
        totalSeats: newScreen.value.totalSeats,
      }

      const res = await updateScreen(EditedScreenId.value, updatePayload)

      if (res.data.success) {
        alert(res.data.message)
        EditedScreenId.value = ''
        handleFetchscreenList()
      }
    } else {
      alert('Fresh data.....')
      const addPayload = {
        name: newScreen.value.name,
        totalSeats: newScreen.value.totalSeats,
        theaterId: TheaterId.value,
      }

      const res = await addScreen(addPayload)

      if (res.data.success) {
        alert(res.data.message)
        handleFetchscreenList()
      }
    }
  } catch (error) {
    console.log(error)
  }

  toast.add({
    severity: 'success',
    summary: 'Added',
    detail: 'Screen added successfully',
    life: 3000,
  })

  // Reset form & close dialog
  resetForm()
}

const resetForm = () => {
  alert('reset funct work...')
  newScreen.value = { name: '', totalSeats: 0 }
  visible.value = false
  EditedScreenId.value = ''
  visible.value = false
}

const handleEditScreen = (screen: any) => {
  // toast.add({ severity: 'warn', summary: 'Edit Screen', detail: screen.name, life: 3000 })
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
        console.log(id)

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
  try {
    const res = await fetchScreenList(TheaterId.value)

    if (res.data.success) {
      alert(res.data.message)
      screens.value = res.data.data.screens
    }
  } catch (error) {
    console.log(error)
  }
}

const handleScreenView = (id: string) => {
  router.push({ name: 'ViewScreen', params: { id } })
}

onMounted(() => {
  handleFetchscreenList()
})
</script>
