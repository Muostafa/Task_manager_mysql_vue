<!-- src/components/TaskCard.vue -->
<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row justify-between items-start no-wrap">
        <div class="col">
          <div class="text-h6" :class="{ 'text-strike text-grey-6': task.status === 'completed' }">
            {{ task.title }}
          </div>
          <div class="text-caption text-grey-7">Created: {{ formatDate(task.created_at) }}</div>
        </div>

        <q-chip
          clickable
          :icon="statusOptions[task.status].icon"
          :color="statusOptions[task.status].color"
          text-color="white"
          class="q-ml-sm"
          square
          size="md"
        >
          {{ statusOptions[task.status].label }}
          <q-menu anchor="bottom right" self="top right">
            <q-list dense style="min-width: 100px">
              <q-item
                v-for="(option, key) in statusOptions"
                :key="key"
                clickable
                v-close-popup
                @click="emit('update', { ...task, status: key })"
              >
                <q-item-section>{{ option.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-chip>
      </div>
      <p class="q-mt-sm text-body2" v-if="task.description">
        {{ task.description }}
      </p>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn flat round dense icon="edit" @click="emit('edit', task)" />
      <q-btn flat round dense icon="delete" color="negative" @click="emit('delete', task.id)" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
// This component receives the task as a prop and emits events when the user interacts.
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update', 'edit', 'delete'])

// A helper object to manage status display properties
const statusOptions = {
  pending: { label: 'Pending', color: 'orange-8', icon: 'pending' },
  'in-progress': { label: 'In Progress', color: 'blue-8', icon: 'sync' },
  completed: { label: 'Completed', color: 'green-8', icon: 'check_circle' },
}

// A helper to format the date string nicely
const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>
