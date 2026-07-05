<template>
    <div>
        <h1>Paiement multiple salaire</h1>

        <div class="filters">
            <select v-model="selectedMonth">
                <option v-for="month in months" :key="month.value" :value="month.value">
                    {{ month.label }}
                </option>
            </select>
            <input type="number" v-model="selectedYear" placeholder="Année" />
        </div>

        <table>
            <thead>
                <tr>
                    <th>Employé</th>
                    <th>Date Début</th>
                    <th>Date Fin</th>
                    <th>Montant</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="salary in filteredSalaries" :key="salary.id">
                    <td>{{ salary.ref }}</td>
                    <td>{{ formatDate(salary.datesp) }}</td>
                    <td>{{ formatDate(salary.dateep) }}</td>
                    <td>{{ salary.amount }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { useSalaryStore } from '@/stores';
import { ref, computed, onMounted } from 'vue';

const salaryStore = useSalaryStore();

const months = [
    { value: 1, label: 'Janvier' }, { value: 2, label: 'Février' }, { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' }, { value: 5, label: 'Mai' }, { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' }, { value: 8, label: 'Août' }, { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' }, { value: 11, label: 'Novembre' }, { value: 12, label: 'Décembre' }
];

const selectedMonth = ref(new Date().getMonth() + 1);
const selectedYear = ref(new Date().getFullYear());

// Fonction pour l'affichage propre dans le tableau
const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("fr-FR");
};

const filteredSalaries = computed(() => {
    return salaryStore.items.filter(salary => {

        const adjustedTimestamp = salaryStore.adjustTimestamp(salary.datesp);
        const date = new Date(adjustedTimestamp * 1000);

        const monthMatch = (date.getUTCMonth() + 1) === selectedMonth.value;
        const yearMatch = date.getUTCFullYear() === selectedYear.value;

        return monthMatch && yearMatch;
    });
});
onMounted(() => {
    salaryStore.fetchSalary();
});
</script>