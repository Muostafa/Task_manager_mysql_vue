<!-- src/components/TaskFormDialog.vue -->
<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => emit('update:modelValue', val)"
    persistent
  >
    <q-card style="width: 500px">
      <q-card-section>
        <div class="text-h6">{{ form.id ? 'Edit Task' : 'Create New Task' }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit.prevent="saveTask">
          <q-input
            v-model="form.title"
            label="Title"
            autofocus
            :rules="[(val) => !!val || 'Title is required']"
          />
          <q-input v-model="form.description" label="Description" type="textarea" class="q-mt-sm" />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Save" color="primary" @click="saveTask" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  modelValue: Boolean, // For v-model
  task: Object, // The task to edit, or null for create
})
const emit = defineEmits(['update:modelValue', 'save'])

const form = ref({
  id: null,
  title: '',
  description: '',
})

// watchEffect will re-run whenever its dependencies change
watchEffect(() => {
  if (props.task) {
    form.value = { ...props.task } // Populate form for editing
  } else {
    // Reset form for creating
    form.value = { id: null, title: '', description: '' }
  }
})

const saveTask = () => {
  // Simple validation
  if (!form.value.title) {
    return // Or show a notification
  }
  emit('save', form.value)
}
</script>
