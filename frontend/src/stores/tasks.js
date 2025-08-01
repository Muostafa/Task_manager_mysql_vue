// src/stores/tasks.js
import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { Notify } from 'quasar'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    error: null,
  }),

  actions: {
    async fetchTasks() {
      this.error = null
      try {
        const response = await api.get('/tasks')
        this.tasks = response.data
      } catch (error) {
        this.error = 'Failed to fetch tasks.'
        Notify.create({ type: 'negative', message: this.error })
      }
    },

    async createTask(taskData) {
      try {
        const response = await api.post('/tasks', {
          title: taskData.title,
          description: taskData.description,
        })
        this.tasks.push(response.data) // Add new task to the list
        Notify.create({ type: 'positive', message: 'Task created successfully!' })
      } catch (error) {
        Notify.create({ type: 'negative', message: 'Failed to create task.' })
        throw error
      }
    },

    async updateTask(task) {
      try {
        const response = await api.put(`/tasks/${task.id}`, {
          title: task.title,
          description: task.description,
          status: task.status,
        })
        const index = this.tasks.findIndex((t) => t.id === task.id)
        if (index !== -1) {
          this.tasks[index] = response.data // Update task in the list
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
        this.tasks = this.tasks.filter((t) => t.id !== taskId) // Remove task from list
        Notify.create({ type: 'positive', message: 'Task deleted successfully!' })
      } catch (error) {
        Notify.create({ type: 'negative', message: 'Failed to delete task.' })
        throw error
      }
    },
  },
})
