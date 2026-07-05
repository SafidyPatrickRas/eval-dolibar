<template>
    <div>
        <h1>Details</h1>
        <div>
            <h3>Info</h3>
            <div v-if="userStore.loading">
                chargement
            </div>
            <div v-else>
                <p>Login : {{ user.login }} </p>
            <p>Fisrtname : {{ user.firstname }}</p>
            </div>
        </div>
        <div>
            <h3>Salaire</h3>
            <div>
                <table border="1">
                    <tr>
                        <th>Ref</th>
                        <th>datesp</th>
                        <th>dateep</th>
                        <th>Amount</th>
                        <th>Rest a payer</th>
                    </tr>
                    <tr v-for=" salary in salarys" :key="salary.id">
                        <td>  <router-link :to="{ name: 'front.salaries.details', params: { id: salary.ref } }">
                    {{ salary.ref }}
                </router-link></td>
                        <td>{{ salaryStore.timeStampToDate(salary.datesp) }}</td>
                        <td>{{ salaryStore.timeStampToDate(salary.dateep) }}</td>
                        <td>{{ salaryStore.getAmountFormated(salary.amount) }}</td>
                        <th>{{ restPayes[salary.id] }}</th>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Total : {{ restPayerTotal }} </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useUserStore , useSalaryStore } from '@/stores';

const userStore = useUserStore()
const salaryStore = useSalaryStore()

const route = useRoute();
const user = ref([])
const salarys = ref([])
const restPayes = ref({});
// Vérification que restPayes existe et est un tableau
// 1. Remplacez la déclaration const par une computed
const restPayerTotal = computed(() => {
  // On récupère les valeurs de l'objet (les montants)
  const valeurs = Object.values(restPayes.value);
  
  return valeurs.reduce((total, item) => {
    const value = Number(item);
    return total + (isNaN(value) ? 0 : value);
  }, 0);
});

onMounted( async()=>{
    console.log("id recu : " + route.params.id)
    user.value = await userStore.fetchUserById(route.params.id)
    salarys.value = await salaryStore.fetchSalaryByUserId(route.params.id)

    for (const salary of salarys.value) {
        restPayes.value[salary.id] =
            await salaryStore.getRestPayeForSalary(salary.id);
    }
})

</script>