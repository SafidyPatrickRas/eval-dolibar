<template>
  <div>
    <h1>Générer les salaires en masse</h1>


    <div class="filters" style="margin-bottom: 20px; padding: 15px; border: 1px solid #ccc;">
      <h3>Filtres des salariés</h3>
      <input v-model="filterPoste" type="text" placeholder="Poste" />
      
      <select v-model="filterGenre">
  <option value="">Tous genres</option>
  <option value="man">Homme</option>
  <option value="woman">Femme</option>
  <option value="other">Autre</option>
</select>
      
      <input type="number" v-model="minHours" placeholder="Heures min" />
      <input type="number" v-model="maxHours" placeholder="Heures max" />
      
      <p>Nombre d'employés sélectionnés : {{ filteredUsers.length }}</p>
    </div>

    <div class="generation">
      <h3>Paramètres du salaire</h3>
      <div>
        <label>Date début</label>
        <input type="date" v-model="date_debut" />
      </div>
      <div>
        <label>Date fin</label>
        <input type="date" v-model="date_fin" />
      </div>
      <div>
        <label>Montant</label>
        <input type="number" v-model="amount" />
      </div>
      <div>
        <label>Commentaire</label>
        <textarea v-model="note_private"></textarea>
      </div>
      
      <button @click="generateSalaries" :disabled="filteredUsers.length === 0">
        Générer pour les {{ filteredUsers.length }} employés
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSalaryStore, useUserStore } from '@/stores';

const salaryStore = useSalaryStore();
const userStore = useUserStore();

// Refs pour les filtres
const filterPoste = ref("");
const filterGenre = ref("");
const minHours = ref(0);
const maxHours = ref(999);

// Refs pour la génération
const label = ref("Salaire");
const date_debut = ref("");
const date_fin = ref("");
const amount = ref(0);
const note_private = ref("");

const filteredUsers = computed(() => {
  return userStore.items.filter(u => {
    // 1. Filtre Genre (avec gestion du "other" par défaut)
    const userGender = (u.gender && u.gender !== "") ? u.gender.toLowerCase() : "other";
    const filterValue = filterGenre.value.toLowerCase();
    const genreMatch = filterGenre.value ? userGender === filterValue : true;
    
    // 2. Filtre Poste (recherche textuelle partielle)
    const userPoste = (u.job || "").toLowerCase();
    const posteMatch = filterPoste.value 
      ? userPoste.includes(filterPoste.value.toLowerCase()) 
      : true;

    // 3. Filtre Heures
    const thm = Number(u.thm) || 0;
    const heures = Number(u.heures) || 0;
    const hoursMatch = thm >= minHours.value && heures <= maxHours.value;

    return genreMatch && posteMatch && hoursMatch;
  });
});

// const filteredUsers = computed(() => {
//   return userStore.items.filter(u => {
    // return (filterPoste.value ? u.poste?.toLowerCase().includes(filterPoste.value.toLowerCase()) : true) &&
        //    (filterGenre.value ? u.gender === filterGenre.value : true) &&
        //    (u.thm >= minHours.value && u.heures <= maxHours.value);
//   });
// });

const generateSalaries = async () => {
  if (!date_debut.value || !date_fin.value || amount.value <= 0) {
    alert("Veuillez remplir les dates et le montant correctement.");
    return;
  }

  if (confirm(`Confirmez-vous la génération de ${filteredUsers.value.length} salaires ?`)) {
    for (const user of filteredUsers.value) {
      await salaryStore.saveSalary(
        user.id,
        label.value,
        date_debut.value,
        date_fin.value,
        amount.value,
        note_private.value
      );
    }
    alert("Salaires générés avec succès !");
  }
};

onMounted(() => {
  userStore.fetchUser();
});
</script>