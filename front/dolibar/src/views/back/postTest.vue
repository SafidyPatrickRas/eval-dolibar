<template>
    <h1>Execution de test</h1>
</template>
<script setup>
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores';
import { useSalaryStore } from '@/stores';

const store = useUserStore()
const salaryStore = useSalaryStore()

onMounted(async () => {
    // const lastname = 'lastname'
    // const firstname = 'Rakotobe'
    // const login = 'rakoto1'
    // const password = 'hImsghv2pqC0'
    // const gender = 'man'
    // const weeklyhours = '35' 
    // await store.saveUser(lastname , firstname , login , password , gender , weeklyhours);

    //const fk_user = 10;
    //const label = "Salaire Juin 2026";
    //const date_debut = "2026-06-01";
    //const date_fin = "2026-06-30";
    //const amount = 2000000;
    //const note_private = "Salaire de test";
//
    //await salaryStore.saveSalary(fk_user , label , date_debut , date_fin , amount , note_private)

    
})

</script>