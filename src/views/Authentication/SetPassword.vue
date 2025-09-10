<template>
  <div class="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 text-center">Set Password</h2>

    <!-- Set Password -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Set Password</label>
      <Password v-model="password" toggleMask placeholder="Enter new password" class="w-full" />
    </div>

    <!-- Confirm Password -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
      <Password
        v-model="confirmPassword"
        toggleMask
        placeholder="Confirm new password"
        class="w-full"
      />
    </div>

    <!-- Button -->
    <Button
      label="Set Password"
      icon="pi pi-lock"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
      @click="handleSetPassword"
      :loading="loading"
    />
  </div>
</template>

<script setup lang="ts">
import { Button, Password } from 'primevue'
import { ref } from 'vue'
import { setPassword } from '@/services/useApiServices'

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const handleSetPassword = async () => {
  if (!password.value || !confirmPassword.value) {
    alert('Both fields are required!')
    return
  }
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match!')
    return
  }

  try {
    loading.value = true
    const payload = { password: password.value }
    const res = await setPassword(payload)

    if (res.data.success) {
      alert('Password set successfully!')
      password.value = ''
      confirmPassword.value = ''
    } else {
      alert(res.data.message || 'Something went wrong')
    }
  } catch (error) {
    console.error(error)
    alert('Failed to set password.')
  } finally {
    loading.value = false
  }
}
</script>
