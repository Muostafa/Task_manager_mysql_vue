// src/stores/auth.js
import { defineStore } from 'pinia'
import { api } from '../boot/axios'
import { Notify } from 'quasar'
import { router } from '../router' // Import router instance

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null, // You could fetch and store user details here if needed
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/auth/login', credentials)
        const token = response.data.token
        this.token = token
        localStorage.setItem('token', token)
        // Redirect to the main page after login
        router.push('/')
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.response?.data?.message || 'Login failed',
        })
        throw error // Re-throw to be caught in the component
      }
    },

    async register(credentials) {
      try {
        await api.post('/auth/register', credentials)
        Notify.create({
          type: 'positive',
          message: 'Registration successful! Please log in.',
        })
        // Redirect to login page after successful registration
        router.push('/login')
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.response?.data?.message || 'Registration failed',
        })
        throw error
      }
    },

    logout() {
      this.token = null
      localStorage.removeItem('token')
      this.user = null
      // Redirect to login page
      router.push('/login')
      Notify.create('You have been logged out.')
    },
  },
})
