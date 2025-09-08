<template>
  <nav class="navbar">
    <!-- Left: Logo -->
    <div class="logo">
      <h1>BookMyShow</h1>
    </div>

    <!-- Middle: Search Bar -->
    <div class="searchBar">
      <input type="text" placeholder="Search movies..." class="searchInput" />
    </div>

    <!-- Right: Buttons -->
    <div class="actionBtn">
      <!-- Sign In Button -->
      <button class="signinBtn">Sign In</button>

      <!-- User Profile Icon -->
      <div class="flex items-center m-2">
        <div class="userProfile">
          <i class="pi pi-user"> </i>
        </div>
        <div style="margin-left: 2px">
          <span>rahul</span>
        </div>
      </div>

      <!-- Dropdown Menu -->
      <div class="dropdownWrapper">
        <button class="dropdownBtn" @click="toggleDropdown">
          <i class="pi pi-bars"></i>
        </button>

        <div v-if="showDropdown" class="dropdownMenu">
          <ul>
            <li>Home</li>
            <li>Movies</li>
            <li>Bookings</li>
            <li>Logout</li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}
</script>

<style scoped>
/* Navbar wrapper */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1f2937; /* dark gray */
  color: white;
  padding: 0 24px;
  height: 64px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Logo */
.logo h1 {
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  margin: 0;
}

/* Search bar */
.searchBar {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 16px;
}

.searchInput {
  width: 50%;
  padding: 10px;
  border-radius: 6px;
  border: none;
  outline: none;
  background: #2d3748;
  color: white;
}

.searchInput:focus {
  border: 2px solid #ef4444; /* red border on focus */
}

/* Action buttons */
.actionBtn {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

/* Sign in button */
.signinBtn {
  background: #ef4444;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.signinBtn:hover {
  background: #dc2626;
}

/* User Profile */
.userProfile {
  width: 40px;
  height: 40px;
  background: #374151;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.userProfile i {
  font-size: 18px;
}

/* Dropdown */
.dropdownWrapper {
  position: relative;
}

.dropdownBtn {
  background: #374151;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.dropdownBtn:hover {
  background: #4b5563;
}

.dropdownMenu {
  position: absolute;
  right: 0;
  top: 45px;
  width: 160px;
  background: white;
  color: black;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.dropdownMenu ul {
  list-style: none;
  padding: 8px 0;
  margin: 0;
}

.dropdownMenu li {
  padding: 10px 16px;
  cursor: pointer;
}

.dropdownMenu li:hover {
  background: #f3f4f6;
}
</style>
