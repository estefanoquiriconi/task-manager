<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppNotification from '@/components/layout/AppNotification.vue'
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
  <AppNotification />
</template>
