import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { useAuthStore } from 'stores/auth'
import { Loading, Notify } from 'quasar' // Import the Loading plugin

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// This counter will track how many requests are currently active.
let activeRequests = 0

export default boot(({ app, store, router }) => {
  // Add 'router' if you use it here
  app.config.globalProperties.$api = api

  // === Request Interceptor ===
  // Fired before each request is sent
  api.interceptors.request.use(
    (config) => {
      // If this is the first active request, show the loading spinner.
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
      // Also decrement on request error
      activeRequests--
      if (activeRequests === 0) {
        Loading.hide()
      }
      return Promise.reject(error)
    },
  )

  // === Response Interceptor ===
  // Fired after a response is received
  api.interceptors.response.use(
    (response) => {
      // If the request was successful, decrement the counter.
      activeRequests--
      // If there are no more active requests, hide the loading spinner.
      if (activeRequests === 0) {
        Loading.hide()
      }
      return response // Pass the response along
    },
    (error) => {
      // If the request failed, also decrement the counter.
      activeRequests--
      // If there are no more active requests, hide the loading spinner.
      if (activeRequests === 0) {
        Loading.hide()
      }

      // Handle specific errors like 401 Unauthorized
      if (error.response && error.response.status === 401) {
        const authStore = useAuthStore(store)
        authStore.logout() // Force logout on token expiry/invalidity
        Notify.create({
          type: 'negative',
          message: 'Your session has expired. Please log in again.',
        })
      }

      return Promise.reject(error) // Pass the error along
    },
  )
})

export { api }
