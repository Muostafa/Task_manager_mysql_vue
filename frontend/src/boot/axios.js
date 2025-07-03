import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { useAuthStore } from 'stores/auth'
import { Loading, Notify } from 'quasar'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// This counter will track how many requests are currently active.
let activeRequests = 0

// This flag prevents multiple "Session Expired" notifications from firing at once.
let isLoggingOut = false

export default boot(({ app, store, router }) => {
  app.config.globalProperties.$api = api

  // === Request Interceptor ===
  api.interceptors.request.use(
    (config) => {
      if (activeRequests === 0) {
        Loading.show()
      }
      activeRequests++

      const authStore = useAuthStore(store)
      const token = authStore.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      activeRequests--
      if (activeRequests === 0) {
        Loading.hide()
      }
      return Promise.reject(error)
    },
  )

  // === Response Interceptor ===
  api.interceptors.response.use(
    (response) => {
      activeRequests--
      if (activeRequests === 0) {
        Loading.hide()
      }
      return response
    },
    (error) => {
      activeRequests--
      if (activeRequests === 0) {
        Loading.hide()
      }

      // --- THE IMPROVED 401 ERROR HANDLING LOGIC ---
      const authStore = useAuthStore(store)

      if (error.response && error.response.status === 401) {
        // We add two critical checks here:
        // 1. `authStore.isAuthenticated`: Only trigger logout if the user was actually logged in.
        //    This prevents this block from running for unauthenticated users.
        // 2. `!isLoggingOut`: Only trigger this once. If multiple 401s happen
        //    simultaneously, we don't want to show multiple popups or call logout multiple times.
        if (authStore.isAuthenticated && !isLoggingOut) {
          isLoggingOut = true // Set the flag immediately

          Notify.create({
            type: 'negative',
            message: 'Your session has expired. Please log in again.',
            position: 'top',
          })

          // Call the logout action from the store.
          // Since logout is async (due to router.push), we can reset our flag after it's done.
          authStore.logout().finally(() => {
            isLoggingOut = false
          })
        }
      }

      return Promise.reject(error) // Pass the error along to be caught by the component/store
    },
  )
})

export { api }
