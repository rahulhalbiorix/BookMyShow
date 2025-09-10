<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Register as End User</h2>

      <!-- Name -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-1">Full Name</label>
        <InputText v-model="name" placeholder="Enter your name" class="w-full" />
      </div>

      <!-- Email -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-1">Email</label>
        <InputText v-model="email" type="email" placeholder="Enter your email" class="w-full" />
      </div>

      <!-- Mobile Number -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-1">Mobile Number</label>
        <InputText
          v-model="mobile"
          type="tel"
          placeholder="Enter your mobile number"
          class="w-full"
        />
      </div>

      <!-- Password -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-1">Password</label>
        <Password v-model="password" toggleMask placeholder="Enter password" class="w-full" />
      </div>

      <!-- Confirm Password -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-1">Confirm Password</label>
        <Password
          v-model="confirmPassword"
          toggleMask
          placeholder="Confirm password"
          class="w-full"
        />
      </div>

      <!-- Register Button -->
      <Button
        label="Register"
        class="w-full p-3 text-lg"
        severity="primary"
        @click="handleRegister"
      />

      <!-- Router Link to Sub-Admin Signup -->
      <p class="text-center text-gray-600 mt-6">
        are you already register ?
        <RouterLink to="/login" class="text-blue-600 font-semibold hover:underline">
          Login here
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { Button, InputText, Password } from 'primevue'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const name = ref('')
const email = ref('')
const mobile = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = () => {
  console.log('User Register:', {
    name: name.value,
    email: email.value,
    mobile: mobile.value,
  })
  // Add API logic here
}
</script>
