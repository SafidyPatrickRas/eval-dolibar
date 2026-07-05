<template>
  <div>
    <h1>Documents</h1>
    nombre {{ items.length }}
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.id }} </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useDocumentsStore } from '@/stores'

const store = useDocumentsStore()
const items = computed(() => store.items)

onMounted(() => {
  store.fetchDocuments()
})
</script>
