<template>
  <header>
    <Navbar></Navbar>
  </header>
  <main>
    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
</script>
