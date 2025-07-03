<!-- src/pages/TasksPage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h4">My Tasks</div>
      <q-btn label="Add Task" color="primary" icon="add" @click="openCreateDialog" />
    </div>

    <!-- Loading State -->
    <div v-if="taskStore.loading && !taskStore.tasks.length" class="text-center q-mt-xl">
      <q-spinner-dots color="primary" size="4em" />
      <div class="q-mt-md text-grey-8">Loading tasks...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="taskStore.error" class="text-center q-mt-xl">
      <q-icon name="error" color="negative" size="4em" />
      <div class="q-mt-md text-negative">{{ taskStore.error }}</div>
      <q-btn label="Retry" color="primary" @click="taskStore.fetchTasks" class="q-mt-md" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!taskStore.tasks.length" class="text-center q-mt-xl">
      <q-icon name="inbox" color="grey-5" size="4em" />
      <div class="q-mt-md text-grey-8">You have no tasks. Add one to get started!</div>
    </div>

    <!-- Task List -->
    <q-list v-else bordered separator>
      <q-item v-for="task in taskStore.tasks" :key="task.id" clickable v-ripple>
        <q-item-section>
          <q-item-label :class="{ 'text-strike': task.status === 'completed' }">
            {{ task.title }}
          </q-item-label>
          <q-item-label caption>{{ task.description }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-select
            dense
            borderless
            v-model="task.status"
            :options="['pending', 'in-progress', 'completed']"
            @update:model-value="(status) => handleUpdate({ ...task, status })"
          />
        </q-item-section>

        <q-item-section side>
          <div class="row">
            <q-btn flat round dense icon="edit" @click="openEditDialog(task)" />
            <q-btn flat round dense icon="delete" color="negative" @click="handleDelete(task.id)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Task Form Dialog -->
    <TaskFormDialog v-model="showTaskDialog" :task="taskToEdit" @save="onTaskSave" />
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useTaskStore } from 'stores/tasks'
import { useQuasar } from 'quasar'
import TaskFormDialog from 'components/TaskFormDialog.vue'

const taskStore = useTaskStore()
const $q = useQuasar()

const showTaskDialog = ref(false)
const taskToEdit = ref(null)

onMounted(() => {
  taskStore.fetchTasks()
})

const openCreateDialog = () => {
  taskToEdit.value = null
  showTaskDialog.value = true
}

const openEditDialog = (task) => {
  taskToEdit.value = { ...task } // Create a copy to avoid reactive mutation
  showTaskDialog.value = true
}

const onTaskSave = async (taskData) => {
  if (taskData.id) {
    // Editing existing task
    await taskStore.updateTask(taskData)
  } else {
    // Creating new task
    await taskStore.createTask(taskData)
  }
  showTaskDialog.value = false
}

const handleUpdate = async (task) => {
  await taskStore.updateTask(task)
}

const handleDelete = (taskId) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete this task?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    taskStore.deleteTask(taskId)
  })
}
</script>
