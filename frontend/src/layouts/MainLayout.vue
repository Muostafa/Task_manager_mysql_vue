<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Task Manager </q-toolbar-title>
        <q-btn flat dense icon="logout" @click="handleLogout" label="Logout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from 'stores/auth'
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>
