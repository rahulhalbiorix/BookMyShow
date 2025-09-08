import instance from './api'

// ╔════════════════════════════╗
// ║ 🔴 Authentication API
// ╚════════════════════════════╝

export const newUserSignUp = (data: FormData) => {
  instance.post('/auth/register', data, { headers: { 'Content-Type': 'application/json' } })
}

export const userLogin = (data: FormData) =>
  instance.post('/auth/login', data, { headers: { 'Content-Type': 'application/json' } })

export const registerSubAdmin = (data: FormData) =>
  instance.post('/auth/register-sub-admin', data, {
    headers: { 'Content-Type': 'application/json' },
  })

export const getUserProfile = () => instance.get('/auth/profile')

export const updateUserProfile = (data: FormData) => instance.put('/auth/update-profile', data)

export const requestResetPassword = (data: FormData) =>
  instance.post('/auth/request-reset', { headers: { 'Content-Type': 'application/json' } })

export const verifyResetToken = (token: string) => instance.get(`/auth/verify-reset-token/${token}`)

export const setPassword = (data: FormData) => instance.post('/auth/set-password', data)

export const fetchListOfSubAdmins = (limit = 10, page = 1) =>
  instance.get('/auth/sub-admins', { params: { page, limit } })

export const activateDeactivateTheater = (ownerId: string) =>
  instance.patch(`/auth/owner-acc-status/${ownerId}`)

// ╔════════════════════════════╗
// ║ 🟡 Theateres API
// ╚════════════════════════════╝

// ╔════════════════════════════╗
// ║ 🟢 Cities API
// ╚════════════════════════════╝

// ╔════════════════════════════╗
// ║ 🔵 screens  API
// ╚════════════════════════════╝

// ╔════════════════════════════╗
// ║  🟠 Movies API
// ╚════════════════════════════╝

export const fetchMovieList = (limit: number, page: number, language: string, category: string) =>
  instance.get('/movies/list', { params: { limit, page, language, category } })

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
