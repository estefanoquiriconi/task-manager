import { createRouter, createWebHistory } from 'vue-router'
import TasksView from '@/views/TasksView.vue'
import TaskFormView from '@/views/TaskFormView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'tasks', component: TasksView },
    { path: '/tasks/create', name: 'task-create', component: TaskFormView },
    { path: '/tasks/:id/edit', name: 'task-edit', component: TaskFormView },
  ],
})

export default router
