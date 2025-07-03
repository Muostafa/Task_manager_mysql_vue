<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-md shadow-2" style="width: 400px">
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">Create Account</div>
        <div class="text-grey-8">Join us to start managing your tasks</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleRegister">
          <q-input
            v-model="form.username"
            label="Username"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Username is required',
              (val) => val.length >= 3 || 'Username must be at least 3 characters',
            ]"
          />

          <q-input
            v-model="form.password"
            label="Password"
            type="password"
            class="q-mt-md"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Password is required',
              (val) => val.length >= 6 || 'Password must be at least 6 characters',
            ]"
          />

          <q-input
            v-model="form.confirmPassword"
            label="Confirm Password"
            type="password"
            class="q-mt-md"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please confirm your password',
              (val) => val === form.password || 'Passwords do not match',
            ]"
          />

          <div class="q-mt-lg">
            <q-btn
              label="Register"
              type="submit"
              color="primary"
              class="full-width"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">
          Already have an account?
          <router-link to="/login" class="text-dark text-weight-bold">Sign in.</router-link>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth'

const $q = useQuasar()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
})

const loading = ref(false)

const handleRegister = async () => {
  // Front-end validation check before hitting the API
  if (form.value.password !== form.value.confirmPassword) {
    $q.notify({
      type: 'negative',
      message: 'Passwords do not match.',
    })
    return // Stop the submission
  }

  loading.value = true
  try {
    // We only need to send username and password to the store action
    await authStore.register({
      username: form.value.username,
      password: form.value.password,
    })
    // The store action handles the success notification and redirection
    // to the login page, so we don't need to do anything here on success.
  } catch (error) {
    // The store action also handles the error notification.
    // This catch block prevents the unhandled promise rejection error in the console.
    console.error('Registration failed:', error)
  } finally {
    // This will run whether the registration succeeds or fails
    loading.value = false
  }
}
</script>

<style scoped>
/* You can add any specific styles here if needed */
</style>
