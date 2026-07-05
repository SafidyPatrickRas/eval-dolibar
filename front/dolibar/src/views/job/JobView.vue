<template>
  <div>
    <h1>Job</h1>
    <router-link :to="{ name: 'front.salaries.details', params: { id: salaryId } }">Ajouter un job</router-link>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.id }} </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useJobStore } from '@/stores'

const store = useJobStore()
const items = computed(() => store.items)

onMounted(() => {
  store.fetchJob()
})
</script>
