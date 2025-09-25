import router from '@/router'
import { userAuthStore } from '@/stores/userAuthStore'

export function handleLogOut() {
  const store = userAuthStore()

  const logOutUser = () => {
    store.logOut()
    router.push({ name: 'Login' })
  }

  return {
    logOutUser,
  }
}
