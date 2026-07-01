<template>
    <div>
        <h1>Login back</h1>
        <div>
            <div>
                <label for="">Login : </label>
                <select name="" id="" v-model="selectedUser">
                    <option :value="user.id" v-for="user in users" :key="user.id">{{ user.login }}</option>
                </select>
            </div>
            <div>
                <label for="password">Password : </label>
                <input type="password" name="password" id="password" v-model="password">
            </div>
            <button @click="goToLogin">Login</button>
        </div>
    </div>
</template>
<script setup>
import { useUserStore } from '@/stores';
import { onMounted, computed, ref } from 'vue'

const selectedUser = ref(0)
const password = ref("hImsghv2pqC0")
const userStore = useUserStore()
const users = computed(() => userStore.items)


const goToLogin = ()=>{
    userStore.goToLogin(selectedUser.value)
}

onMounted(() => {
  userStore.fetchUser()
})
</script>