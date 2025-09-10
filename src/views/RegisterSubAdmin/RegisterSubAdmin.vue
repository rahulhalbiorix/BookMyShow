<template>
  <div class="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 text-center">Register Sub Admin</h2>

    <!-- Email -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <InputText v-model="email" type="email" placeholder="Enter sub admin email" class="w-full" />
    </div>

    <!-- Name -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
      <InputText v-model="name" type="text" placeholder="Enter sub admin name" class="w-full" />
    </div>

    <!-- Mobile -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
      <InputText v-model="mobile" type="tel" placeholder="Enter mobile number" class="w-full" />
    </div>

    <!-- Button -->
    <Button
      label="Register"
      icon="pi pi-user-plus"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
      @click="handleRegister"
      :loading="loading"
    />
  </div>
</template>

<script setup lang="ts">
import { Button, InputText } from 'primevue'
import { registerSubAdmin } from '@/services/useApiServices'
import { ref } from 'vue'

const email = ref('')
const name = ref('')
const mobile = ref('')
const loading = ref(false)

const handleRegister = async () => {
  try {
    loading.value = true
    const payload = {
      email: email.value,
      name: name.value,
      mobile: mobile.value,
    }

    const res = await registerSubAdmin(payload)
    if (res.data.success) {
      alert('Sub Admin registered successfully!')
      email.value = ''
      name.value = ''
      mobile.value = ''
    } else {
      alert(res.data.message || 'Something went wrong')
    }
  } catch (error) {
    console.error(error)
    alert('Failed to register sub admin.')
  } finally {
    loading.value = false
  }
}
</script>
