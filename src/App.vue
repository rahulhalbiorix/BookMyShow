<template>
  <main>
    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'

import { userAuthStore } from './stores/userAuthStore'

const store = userAuthStore()
</script>
