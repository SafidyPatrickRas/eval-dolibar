<template>
  <div>
    <h1>User</h1>
    <table>
      <tr>
        <td>id</td>
        <td>login</td>
        <td>firstname</td>
      </tr>
      <tr v-for="item in items" :key="item.id">
        <td><router-link
  :to="{ name: 'back.users.details', params: { id: item.id } }"
>
  {{ item.id }}
</router-link></td>
        <td>{{ item.login }}</td>
        <td>{{ item.firstname }}</td>
      </tr>
      
    </table>
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
