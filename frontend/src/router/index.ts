import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guest: true },
    },
    {
      path: '/',
      name: 'tasks',
      component: () => import('@/views/TasksView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/tasks/create',
      name: 'task-create',
      component: () => import('@/views/TaskFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/tasks/:id/edit',
      name: 'task-edit',
      component: () => import('@/views/TaskFormView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    await authStore.initAuth()
    if (!authStore.isAuthenticated) {
      return { name: 'login' }
    }
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    return { name: 'tasks' }
  }
})

export default router
