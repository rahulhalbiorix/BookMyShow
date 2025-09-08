import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const userAuthStore = defineStore('authstore', () => {
  const token = ref('')

  function setToken(payload: string) {
    token.value = payload
  }

  return { token, setToken }
})
