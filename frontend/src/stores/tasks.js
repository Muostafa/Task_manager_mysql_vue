// src/stores/tasks.js
import { defineStore } from 'pinia'
import { api } from 'boot/api'
import { Notify } from 'quasar'

export const useTaskStore = defineStore('tasks', {
  // We no longer need loading and error state here for the global loader
  state: () => ({
    tasks: [],
    // loading: false, // REMOVED
    error: null, // Keep error for displaying specific messages if you want
  }),

  actions: {
    async fetchTasks() {
      // this.loading = true; // REMOVED
      this.error = null
      try {
        const response = await api.get('/tasks')
        this.tasks = response.data
      } catch (error) {
        this.error = 'Failed to fetch tasks.'
        // The global interceptor will show a generic error, but we can still show a specific one
        Notify.create({ type: 'negative', message: this.error })
      }
      // finally { this.loading = false; } // REMOVED
    },

    async createTask(taskData) {
      // this.loading = true; // REMOVED
      try {
        const response = await api.post('/tasks', taskData)
        this.tasks.push(response.data)
        Notify.create({ type: 'positive', message: 'Task created successfully!' })
      } catch (error) {
        // The interceptor already hides the loader and can show a generic error
        // We can add a specific notification here if we want.
        Notify.create({ type: 'negative', message: 'Failed to create task.' })
        throw error
      }
      // finally { this.loading = false; } // REMOVED
    },

    // Apply the same removal of `this.loading = ...` to updateTask and deleteTask
    async updateTask(task) {
      try {
        const response = await api.put(`/tasks/${task.id}`, task)
        const index = this.tasks.findIndex((t) => t.id === task.id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }
        Notify.create({ type: 'positive', message: 'Task updated successfully!' })
      } catch (error) {
        Notify.create({ type: 'negative', message: 'Failed to update task.' })
        throw error
      }
    },

    async deleteTask(taskId) {
      try {
        await api.delete(`/tasks/${taskId}`)
        this.tasks = this.tasks.filter((t) => t.id !== taskId)
        Notify.create({ type: 'positive', message: 'Task deleted successfully!' })
      } catch (error) {
        Notify.create({ type: 'negative', message: 'Failed to delete task.' })
        throw error
      }
    },
  },
})
