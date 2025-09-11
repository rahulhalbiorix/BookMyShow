import instance from './api'

// ╔════════════════════════════╗
// ║ 🔴 Authentication API
// ╚════════════════════════════╝

export const newUserSignUp = (data: FormData) => {
  instance.post('/auth/register', data, { headers: { 'Content-Type': 'application/json' } })
}

export const userLogin = (data: any) =>
  instance.post('/auth/login', data, { headers: { 'Content-Type': 'application/json' } })

export const registerSubAdmin = (data: any) =>
  instance.post('/auth/register-sub-admin', data, {
    headers: { 'Content-Type': 'application/json' },
  })

export const getUserProfile = () => instance.get('/auth/profile')

export const updateUserProfile = (data: FormData) => instance.put('/auth/update-profile', data)

export const requestResetPassword = (data: FormData) =>
  instance.post('/auth/request-reset', { headers: { 'Content-Type': 'application/json' } })

export const verifyResetToken = (token: string) => instance.get(`/auth/verify-reset-token/${token}`)

export const setPassword = (data: any) =>
  instance.post('/auth/set-password', data, { headers: { 'Content-Type': 'application/json' } })

export const fetchListOfSubAdmins = (limit = 10, page = 1) =>
  instance.get('/auth/sub-admins', { params: { page, limit } })

export const activateDeactivateTheater = (ownerId: string) =>
  instance.patch(`/auth/owner-acc-status/${ownerId}`)

// ╔════════════════════════════╗
// ║ 🟡 Theateres API
// ╚════════════════════════════╝

export const fetchtheaterList = (ownerId: string, isActive: boolean | '', limit = 30, page = 1) =>
  instance.get('/theaters', { params: { ownerId, isActive, limit, page } })

export const addtheater = (data: FormData) => instance.post('/theaters/add-theater', data)

export const fetchtheaterdetailes = (id: string) =>
  instance.get(`/theaters/get-detail-of-theater/${id}`)

export const updatetheater = (id: string, data: FormData) =>
  instance.patch(`/theaters/update-theater/${id}`, data)

export const activateInactivatetheater = (id: string) => instance.patch(`/theaters/status/${id}`)

export const deletetheater = (id: string) => instance.delete(`/theaters/delete-theater/${id}`)

// ╔════════════════════════════╗
// ║ 🟢 Cities API
// ╚════════════════════════════╝

export const fetchCities = () => instance.get('/cities/list-cities')

// ╔════════════════════════════╗
// ║ 🔵 screens  API
// ╚════════════════════════════╝

// ╔════════════════════════════╗
// ║  🟠 Movies API
// ╚════════════════════════════╝

export const fetchMovieList = (limit: number, page: number, language: string, category: string) =>
  instance.get('/movies/list', { params: { limit, page, language, category } })

export const fetchSingleMovie = (id: string) => instance.get(`/movies/${id}`)

// ╔════════════════════════════╗
// ║  🟣 Shows API
// ╚════════════════════════════╝

// ╔════════════════════════════╗
// ║  ⚪ SeatLayout API
// ╚════════════════════════════╝

// ╔════════════════════════════╗
// ║  🟢 default API
// ╚════════════════════════════╝

// ╔════════════════════════════╗
// ║  🟤 User Dashboard API
// ╚════════════════════════════╝

// ╔════════════════════════════╗
// ║  🟠 Booking API
// ╚════════════════════════════╝
