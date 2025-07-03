<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-md shadow-2" style="width: 400px">
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">Sign in</div>
        <div class="text-grey-8">Sign in to access your tasks</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="handleLogin">
          <q-input
            v-model="form.username"
            label="Username"
            lazy-rules
            :rules="[(val) => !!val || 'Username is required']"
          />
          <q-input
            v-model="form.password"
            label="Password"
            type="password"
            lazy-rules
            :rules="[(val) => !!val || 'Password is required']"
          />
          <div class="q-mt-md">
            <q-btn
              label="Login"
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
          Don't have an account?
          <router-link to="/register" class="text-dark text-weight-bold">Sign up.</router-link>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth'

const authStore = useAuthStore()
const form = ref({
  username: '',
  password: '',
})
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    await authStore.login(form.value)
    // Redirect is handled inside the store action
  } catch (error) {
    // Error notification is handled in the store
  } finally {
    loading.value = false
  }
}
</script>
