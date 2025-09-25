import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const userAuthStore = defineStore(
  'authstore',
  () => {
    const token = ref('')
    const userRole = ref('')
    const userName = ref('')
    const OwnerId = ref('')
    const isUserLoggedIn = ref(false)

    function setToken(payload: string) {
      token.value = payload
    }

    function setOwnerId(payload: string) {
      OwnerId.value = payload
    }

    function setUserRole(payload: string) {
      userRole.value = payload
    }

    function setUserName(payload: string) {
      userName.value = payload
    }

    function logOut() {
      token.value = ''
      userRole.value = ''
      userName.value = ''
      OwnerId.value = ''
      isUserLoggedIn.value = false
    }

    return {
      token,
      setToken,
      userRole,
      setUserRole,
      userName,
      setUserName,
      OwnerId,
      setOwnerId,
      logOut,
      isUserLoggedIn,
    }
  },
  {
    persist: true,
  },
)
