<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Récupère dynamiquement le layout (défaut 'front' si rien n'est précisé)
const layout = computed(() => route.meta.layout || 'front')

const isLogined = ()=>{
  if(localStorage.getItem("id_user_logined")){
    return true
  }
  return false
}

const isSalaryRoute = computed(() => {
  return route.name && route.name.toString().includes('salaries')
})

const isUserRoute = computed(() => {
  return route.name && route.name.toString().includes('users')
})
</script>

<template>
  <div>
    <nav v-if="layout === 'front'">
      <router-link to="/index">Accueil</router-link>
      <router-link to="/front/salaries">Salaries</router-link>
    </nav>

    <nav v-else-if="layout === 'back'" class="admin-nav">
      <router-link to="/back/index">Admin</router-link>
      <router-link to="/back/reinitialisation">Reinitialisation</router-link>
      <router-link to="/back/users">Users</router-link>
      <router-link to="/back/dashboard">Dashboard</router-link>
      <router-link to="/back/import">Import</router-link>

      <div v-if="isLogined">
        Utilisateur connecter
        <router-link to="/back/logout">Logout</router-link>
      </div>
      <div v-else>
        Login
      </div>
    </nav>







    <nav v-if="isSalaryRoute" class="salary-subnav">
      <router-link to="/front/salaries">Liste des salaires</router-link>
      <router-link to="/front/salaries/create">Ajouter un salaire</router-link>
    </nav>

    <nav v-if="isUserRoute" class="salary-subnav">
      <router-link to="/back/users">Liste des utilisateurs</router-link>
      <!-- <router-link to="/front/salaries/create">Ajouter un salaire</router-link> -->
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
.salary-subnav {
  background: #f4f4f4;
  padding: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
}
</style>