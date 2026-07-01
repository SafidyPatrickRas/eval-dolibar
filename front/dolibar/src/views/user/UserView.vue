<template>
  <div>
    <h1>User</h1>
    nombre {{ items.length }}
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.id }} </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores'

const store = useUserStore()
const items = computed(() => store.items)

onMounted(() => {
  store.fetchUser()
})
</script>
