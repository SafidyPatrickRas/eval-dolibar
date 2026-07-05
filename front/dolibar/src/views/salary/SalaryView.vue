<template>
  <div>
    <hr />
    <h1>Salary</h1>
    <p>Nombre : {{ filteredItems.length }}</p>
    <table border="1">
      <tr>
        <td><input type="number" v-model="filterRef" placeholder="Ref" /></td>
        <td><input type="text" v-model="filterLabel" placeholder="Libellé" /></td>
        <td><input type="date" v-model="filterDateStart" /></td>
        <td><input type="date" v-model="filterDateEnd" /></td>
        <td><input type="text" v-model="filterUser" placeholder="Salarie" /></td>
        <td>
          <select v-model="filterType">
            <option value="">Tous</option>
            <option :value="t.id" v-for="t in typePayements" :key="t.id">
              {{ t.label }}
            </option>
          </select>
        </td>
        <td>
          <input type="number" v-model="filterAmountMin" placeholder="Min" />
          <input type="number" v-model="filterAmountMax" placeholder="Max" />
        </td>
        <td></td>
      </tr>
      <tr>
        <th>Ref</th>
        <th>Libele</th>
        <th>date debut</th>
        <th>date fin</th>
        <th>Salarie</th>
        <th>Reglement</th>
        <th>Montant</th>
        <th>Etat</th>
      </tr>
      <tr v-for="item in filteredItems" :key="item.id">
        <td>
          <router-link :to="{ name: 'front.salaries.details', params: { id: item.id } }">
            {{ item.id }}
          </router-link>
        </td>
        <td>{{ item.label }}</td>
        <td>{{ store.timestampToDisplayDate(item.datesp) }}</td>
        <td>{{ store.timeStampToDate(item.dateep) }}</td>
        <td>{{ getUserName(item.fk_user) }}</td>
        <td>{{ item.type_payment }}</td>
        <td>
          {{
            Number(item.amount).toLocaleString("fr-FR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </td>
        <td>{{ statuts[item.id] || "Chargement..." }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { useSalaryStore, useUserStore, useTypePayementStore } from "@/stores";

const filterRef = ref("");
const filterLabel = ref("");
const filterDateStart = ref("");
const filterDateEnd = ref("");
const filterUser = ref("");
const filterType = ref("");
const filterAmountMin = ref(null);
const filterAmountMax = ref(null);

const store = useSalaryStore();
const userStore = useUserStore();
const typePayementStore = useTypePayementStore();

const statuts = computed(() => store.statuts);
const typePayements = computed(() => typePayementStore.items);

const getUserName = (id) => {
  return userStore.items.find((item) => item.id == id)?.login ?? "Inconnu";
};

const filteredItems = computed(() => {
  return store.items.filter((item) => {
    // Filtre Ref
    if (filterRef.value && !String(item.id).includes(filterRef.value)) return false;
    
    // Filtre Libellé
    if (filterLabel.value && !item.label.toLowerCase().includes(filterLabel.value.toLowerCase())) return false;

    // Filtre Date : Conversion interne pour comparaison
    if (filterDateStart.value || filterDateEnd.value) {
      const d = new Date(item.datesp * 1000);
      const dateS = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
      
      if (filterDateStart.value && dateS < filterDateStart.value) return false;
      if (filterDateEnd.value && dateS > filterDateEnd.value) return false;
    }

    // Filtre Salarié
    if (filterUser.value) {
      const userName = getUserName(item.fk_user).toLowerCase();
      if (!userName.includes(filterUser.value.toLowerCase())) return false;
    }

    // Filtre Type
    if (filterType.value && String(item.type_payment) !== String(filterType.value)) return false;

    // Filtre Montant
    if (filterAmountMin.value !== null && Number(item.amount) < filterAmountMin.value) return false;
    if (filterAmountMax.value !== null && Number(item.amount) > filterAmountMax.value) return false;

    return true;
  });
});

onMounted(async () => {
  await Promise.all([
    store.fetchSalary(),
    userStore.fetchUser(),
    typePayementStore.fetchAll(),
  ]);
  store.calculateAllStatuts();
});
</script>