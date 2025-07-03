<template>
  <q-layout>
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center"> Task Manager App </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <!-- This is where the LoginPage or RegisterPage component will be injected by the router -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// This layout is very simple, so no special script logic is needed.
// The `setup` tag is here for consistency.
</script>

<style scoped>
/* You can add specific styles for this layout if needed */
</style>
