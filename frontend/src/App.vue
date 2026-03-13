<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppNotification from '@/components/layout/AppNotification.vue'

const route = useRoute()
const authStore = useAuthStore()

authStore.initAuth()

const isGuestRoute = computed(() => route.meta.guest === true)
</script>

<template>
  <template v-if="isGuestRoute">
    <RouterView />
  </template>
  <AppLayout v-else>
    <RouterView />
  </AppLayout>
  <AppNotification />
</template>
