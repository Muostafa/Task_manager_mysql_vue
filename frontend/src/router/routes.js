// src/router/routes.js
import { useAuthStore } from 'stores/auth'

const routes = [
  // --- Main App Routes (Protected) ---
  // This group uses MainLayout.vue and requires authentication.
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    // This navigation guard protects all child routes.
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        next() // User is authenticated, proceed.
      } else {
        next('/login') // User is not authenticated, redirect to login.
      }
    },
    children: [
      { path: '', component: () => import('pages/TasksPage.vue') },
      // You could add other protected pages here like '/profile', '/settings', etc.
    ],
  },

  // --- Authentication Routes (Public) ---
  // This group uses the new AuthLayout.vue for a consistent auth experience.
  {
    path: '/auth', // This path segment is just for grouping, it won't be visible in the URL.
    component: () => import('layouts/AuthLayout.vue'),
    // This guard prevents logged-in users from seeing the login/register pages.
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        next('/') // If already logged in, redirect to the main app.
      } else {
        next() // Otherwise, proceed to the login/register page.
      }
    },
    children: [
      {
        path: '/login', // Using absolute path to override parent
        component: () => import('pages/LoginPage.vue'),
      },
      {
        path: '/register', // Using absolute path to override parent
        component: () => import('pages/RegisterPage.vue'),
      },
    ],
  },

  // Always leave this as last one for 404 handling.
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
