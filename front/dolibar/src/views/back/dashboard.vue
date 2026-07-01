<template>
  <div>
    <h1>Dashboard</h1>
    
    <div>
      <h2>Salaires par mois (entre deux années)</h2>
      <select v-model="startYear">
        <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
      </select>
      <select v-model="endYear">
        <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
      </select>
      <button @click="calculateStats">Rechercher</button>

      <div v-for="stat in salaryStats" :key="stat.month">
        <p>Mois : {{ stat.month }} | Total : {{ salaryStore.getAmountFormated(stat.total) }}</p>
      </div>
    </div>

    <hr />

    <div>
      <h2>Statistiques Globales par Genre</h2>
      <div v-for="stat in genderStats" :key="stat.gender">
        <p>Sexe : {{ stat.gender }} | Total : {{ salaryStore.getAmountFormated(stat.total) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSalaryStore  , useUserStore} from '@/stores';
import { ref, onMounted } from 'vue';


const salaryStore = useSalaryStore();
const userStore = useUserStore()

// États pour les dates
const startYear = ref(2026);
const endYear = ref(2026);
const availableYears = [2025, 2026, 2027, 2028, 2029, 2030];

// États pour les résultats
const salaryStats = ref([]);
const genderStats = ref([]);

// Calcul des stats par mois (au clic sur le bouton)
const calculateStats = () => {
  const filtered = salaryStore.items.filter(s => {
    const year = new Date(s.dateep * 1000).getFullYear();
    return year >= startYear.value && year <= endYear.value;
  });

  const groups = filtered.reduce((acc, s) => {
    const date = new Date(s.dateep * 1000);
    const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    acc[month] = (acc[month] || 0) + Number(s.amount);
    return acc;
  }, {});

  salaryStats.value = Object.keys(groups).map(month => ({ month, total: groups[month] }));
};

// Calcul des stats par genre (indépendant, calculé au chargement)
const calculateGenderStats = () => {
  const groups = salaryStore.items.reduce((acc, s) => {
    const user = userStore.items?.find(u => u.id == s.fk_user);
    const gender = user ? user.gender : 'inconnu';
    acc[gender] = (acc[gender] || 0) + Number(s.amount);
    return acc;
  }, {});

  genderStats.value = Object.keys(groups).map(gender => ({ gender, total: groups[gender] }));
};

onMounted(async () => {
  await salaryStore.fetchSalary();
  await userStore.fetchUser();
  // On lance le calcul des stats genre dès que les données sont là
  calculateGenderStats();
});
</script>