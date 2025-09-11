<template>
  <div class="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 text-center">Set Password</h2>
    <h3 class="text-2xl font-semibold text-blue-300 text-center">{{ email }}</h3>
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
import { onMounted, ref } from 'vue'
import { setPassword } from '@/services/useApiServices'
import { useRoute } from 'vue-router'
import router from '@/router'

const tokenForSetPassword = ref<string>('')
const email = ref<string>('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const route = useRoute()

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
    const payload = { token: tokenForSetPassword.value, newPassword: password.value }
    const res = await setPassword(payload)

    if (res.data.success) {
      alert('Password set successfully!')
      password.value = ''
      confirmPassword.value = ''
      tokenForSetPassword.value = ''
      email.value = ''
      router.push({ name: 'Login' })
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

onMounted(() => {
  tokenForSetPassword.value = (route.query.token as string) || ''
  email.value = (route.query.email as string) || ''
})
</script>
