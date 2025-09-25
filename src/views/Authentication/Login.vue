<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>

      <!-- Email Input -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-1">Email</label>
        <InputText v-model="email" type="email" placeholder="Enter your email" class="w-full" />
      </div>

      <!-- Password Input -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-1">Password</label>
        <Password v-model="password" toggleMask placeholder="Enter your password" class="w-full" />
      </div>

      <!-- Login Button -->
      <Button label="Login" class="w-full p-3 text-lg" severity="primary" @click="handleLogin" />

      <!-- SignUp Link -->
      <p class="text-center text-gray-600 mt-6">
        Don’t have an account?
        <RouterLink to="/signup-user" class="text-blue-600 font-semibold hover:underline">
          Sign Up
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, InputText, Password } from 'primevue'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { userLogin } from '@/services/useApiServices'
import { userAuthStore } from '@/stores/userAuthStore'
import router from '@/router'

const store = userAuthStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    const payload = {
      email: email.value,
      password: password.value,
    }

    const res = await userLogin(payload)

    if (res.data.success) {
      alert(res.data.message)
      store.setUserRole(res.data.data.role)
      store.setToken(res.data.data.token)
      store.setUserName(res.data.data.name)
      store.setOwnerId(res.data.data._id)
      store.isUserLoggedIn = true
      if (res.data.data.role === 'super_admin') {
        router.push({ name: 'SuperAdmin' })
      } else if (res.data.data.role === 'sub_admin') {
        router.push({ name: 'SubAdmin' })
      } else {
        router.push({ name: 'EndUser' })
      }
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped>
/* Optional: You can customize PrimeVue input fields with Tailwind */
</style>
