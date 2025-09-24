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

export const activateDeactivatetheater = (id: string) => instance.patch(`/theaters/status/${id}`)

export const deletetheater = (id: string) => instance.delete(`/theaters/delete-theater/${id}`)

// ╔════════════════════════════╗
// ║ 🟢 Cities API
// ╚════════════════════════════╝

export const fetchCities = () => instance.get('/cities/list-cities')

// ╔════════════════════════════╗
// ║ 🔵 screens  API
// ╚════════════════════════════╝

export const fetchScreenList = (
  TheaterId: string,
  isComplete = 'false',
  isActive = 'false',
  limit = 30,
  page = 1,
) => instance.get(`/screens/list/${TheaterId}`, { params: { isComplete, isActive, limit, page } })

export const fetchScreenDetails = (id: string) => instance.get(`/screens/get-screen-details/${id}`)

export const updateScreen = (id: string, data: any) =>
  instance.put(`/screens/update-screen/${id}`, data, {
    headers: { 'Content-Type': 'application/json' },
  })

export const deleteScreen = (id: string) => instance.delete(`/screens/delete-screen/${id}`)

export const addScreen = (data: any) =>
  instance.post(`/screens/add-screen`, data, { headers: { 'Content-Type': 'application/json' } })

export const toggleScreen = (id: string) => instance.patch(`/screens/screen-status/${id}`)

// ╔════════════════════════════╗
// ║  🟠 Movies API
// ╚════════════════════════════╝

export const fetchMovieList = (limit: number, page: number, language: string, category: string) =>
  instance.get('/movies/list', { params: { limit, page, language, category } })

export const fetchSingleMovie = (id: string) => instance.get(`/movies/${id}`)

// ╔════════════════════════════╗
// ║  🟣 Shows API
// ╚════════════════════════════╝

export const addShows = (data: any) =>
  instance.post('/shows/add-show', data, { headers: { 'Content-Type': 'application/json' } })

export const showList = (theaterId: string, screenId: string, movieId: string, startDate: string) =>
  instance.get('/shows/list', { params: { theaterId, screenId, movieId, startDate } })

export const showDetails = (showId: string) => instance.get(`/shows/details/${showId}`)

export const updateShow = (showId: string, data: any) =>
  instance.put(`/shows/update/${showId}`, data, { headers: { 'Content-Type': 'application/json' } })

export const showStatus = (showId: string, data: any) =>
  instance.put(`/shows/status/${showId}`, data, { headers: { 'Content-Type': 'application/json' } })

export const deleteShows = (showId: string) => instance.delete(`/shows/delete/${showId}`)

// ╔════════════════════════════╗
// ║  ⚪ SeatLayout API
// ╚════════════════════════════╝

export const fetchseatLayout = (id: string) => instance.get(`/seat-layout/${id}`)

export const createSeatLayout = (data: any) =>
  instance.post('/seat-layout/create-seat-layout', data, {
    headers: { 'Content-Type': 'application/json' },
  })

export const updateSeatLayout = (id: string, data: any) =>
  instance.put(`/seat-layout/${id}`, data, {
    headers: { 'Content-Type': 'application/json' },
  })

export const updateSeatAvailability = (id: string, data: any) =>
  instance.patch(`/seat-layout/${id}/seats`, data, {
    headers: { 'Content-Type': 'application/json' },
  })

// ╔════════════════════════════╗
// ║  🟢 default API
// ╚════════════════════════════╝

// ╔════════════════════════════╗
// ║  🟤 User Dashboard API
// ╚════════════════════════════╝

export const fetchUserListShow = (
  theaterId: string,
  screenId: string,
  movieId: string,
  startDate: string,
) =>
  instance.get('/user-dashboard/list-shows', {
    params: { theaterId, screenId, movieId, startDate },
  })

// ╔════════════════════════════╗
// ║  🟠 Booking API
// ╚════════════════════════════╝
