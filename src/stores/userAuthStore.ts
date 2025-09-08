import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const userAuthStore = defineStore('authstore', () => {
  const token = ref('')

  const userRole = ref('')

  function setToken(payload: string) {
    token.value = payload
  }

  function setUserRole(payload: string) {
    userRole.value = payload
  }

  return { token, setToken, userRole, setUserRole }
})
