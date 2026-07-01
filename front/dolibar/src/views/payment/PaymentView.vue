<template>
  <div>
    <h1>Payment</h1>
    nombre {{ items.length }}
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.id }} </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { usePaymentStore } from '@/stores'

const store = usePaymentStore()
const items = computed(() => store.items)

onMounted(() => {
  store.fetchPayment()
})
</script>
