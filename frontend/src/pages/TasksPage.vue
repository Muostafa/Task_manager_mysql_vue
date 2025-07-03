<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row justify-between items-center q-mb-lg">
      <h4 class="text-h4 text-weight-bold q-my-none">My Tasks</h4>
      <q-btn label="Add Task" color="primary" icon="add" unelevated @click="openCreateDialog" />
    </div>

    <!-- Error State -->
    <div v-if="taskStore.error" class="text-center q-mt-xl">
      <q-icon name="error" color="negative" size="4em" />
      <div class="q-mt-md text-negative">{{ taskStore.error }}</div>
      <q-btn label="Retry" color="primary" @click="taskStore.fetchTasks" class="q-mt-md" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!taskStore.tasks.length" class="text-center q-mt-xl">
      <q-icon name="inbox" color="grey-5" size="4em" />
      <div class="q-mt-md text-grey-8">You have no tasks. Add one to get started!</div>
    </div>

    <!-- Task List (Now beautifully clean) -->
    <div v-else class="row q-col-gutter-md">
      <div v-for="task in sortedTasks" :key="task.id" class="col-12 col-md-6 col-lg-4">
        <TaskCard
          :task="task"
          @update="handleUpdate"
          @edit="openEditDialog"
          @delete="handleDelete"
        />
      </div>
    </div>

    <TaskFormDialog v-model="showTaskDialog" :task="taskToEdit" @save="onTaskSave" />
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useTaskStore } from 'stores/tasks'
import { useQuasar } from 'quasar'

// Import the new components
import TaskCard from 'components/TaskCard.vue'
import TaskFormDialog from 'components/TaskFormDialog.vue'

const taskStore = useTaskStore()
const $q = useQuasar()

const showTaskDialog = ref(false)
const taskToEdit = ref(null)

// --- COMPUTED ---
// Sort tasks to show the most recently created ones first
const sortedTasks = computed(() => {
  return [...taskStore.tasks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  taskStore.fetchTasks()
})

// --- METHODS (Event Handlers) ---
const handleUpdate = async (task) => {
  await taskStore.updateTask(task)
}

const openEditDialog = (task) => {
  taskToEdit.value = { ...task }
  showTaskDialog.value = true
}

const handleDelete = (taskId) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: 'This action is permanent. Are you sure you want to delete this task?',
    persistent: true,
    ok: { label: 'Delete', color: 'negative', unelevated: true },
    cancel: { label: 'Cancel', color: 'secondary', flat: true },
  }).onOk(() => {
    taskStore.deleteTask(taskId)
  })
}

const openCreateDialog = () => {
  taskToEdit.value = null
  showTaskDialog.value = true
}

const onTaskSave = async (taskData) => {
  if (taskData.id) {
    await taskStore.updateTask(taskData)
  } else {
    await taskStore.createTask(taskData)
  }
  showTaskDialog.value = false
}
</script>

<style lang="scss" scoped>
.q-page {
  background-color: $grey-2;
}
.body--dark .q-page {
  background-color: $dark-page;
}
</style>
