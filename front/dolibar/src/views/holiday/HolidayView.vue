<template>
  <div>
    <h1>Holiday</h1>
    <router-link to="/back/holidays/form">Ajouter un jours ferie</router-link>
    nombre {{ items.length }}
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.id }} </li>
    </ul>

    <table>
      <tr>
        <th>Name</th>
        <th>Date</th>
        <th>Description</th>
        <th>Action</th>
      </tr>

      <tr v-for="item in items" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.date }}</td>
        <td>{{ item.description }}</td>
        <td><button @click="deleteHolly(item.id)">suprimer</button><button><router-link :to="{ path: '/back/holidays/form', query: { id: item.id } }">
              Update
            </router-link></button></td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useHolidayStore } from '@/stores'

const store = useHolidayStore()
const items = computed(() => store.items)

const deleteHolly =async (id)=>{
  await store.delete(id)
  store.fetchHoliday()
}

onMounted(() => {
  store.fetchHoliday()
})
</script>
