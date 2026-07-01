<template>
  <div>
    <h1>Bankaccount</h1>
    nombre {{ items.length }}
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.id }} </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useBankaccountStore } from '@/stores'

const store = useBankaccountStore()
const items = computed(() => store.items)

onMounted(() => {
  store.fetchBankaccount()
})
</script>
