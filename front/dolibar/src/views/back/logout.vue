<template>
    <h1>Logout</h1>
</template>

<script setup>
import { onMounted, computed } from 'vue'

import { useUserStore } from '@/stores';

const userStore = useUserStore()

onMounted(() => {
  userStore.goToLogOut()
})
</script>