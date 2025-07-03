// src/boot/api.js
import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { useAuthStore } from 'stores/auth' // We will create this store next

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
})

export default boot(({ app, store }) => {
  // for use inside Vue files (Options API) through this.$api
  app.config.globalProperties.$api = api

  // Add a request interceptor
  api.interceptors.request.use(
    (config) => {
      // We need to get the Pinia store instance
      const authStore = useAuthStore(store)
      const token = authStore.token

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )
})

export { api }
