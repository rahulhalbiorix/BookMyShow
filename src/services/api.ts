import axios from 'axios'
import { userAuthStore } from '@/stores/userAuthStore'

const instance = axios.create({
  baseURL: 'https://theater-booking-system.onrender.com',
  headers: { 'Content-Type': 'multipart/form-data' },
})

instance.interceptors.request.use(
  (config) => {
    const authStore = userAuthStore()

    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default instance
