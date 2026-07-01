<template>
    <div>
        <h1>Creation de salaire</h1>
        <div>
            <label for="fk_user">Salarie</label>
            <select name="fk_user" id="fk_user" v-model="fk_user">
                <option  v-for="user in users" :key="user.id" :value="user.id">  {{ user.firstname }} {{ user.id }}</option>
            </select>
            
        </div>
        <div>
            <label for="label">Label</label>
            <input type="text" name="label" id="label" v-model="label">
        </div>
        <div>
            <label for="date-debut">Date debut</label>
            <input type="date" name="" id="" v-model="date_debut">
        </div>
        <div>
            <label for="date-debut">Date debut</label>
            <input type="date" name="" id="" v-model="date_fin">
        </div>
        <div>
            <label for="amount">Montant</label>
            <input type="number" name="amount" id="amount" v-model="amount">
        </div>
        <div>
            <label for="note_private">Commentaire</label>
            <textarea name="note_private" id="note_private" cols="30" rows="10" v-model="note_private"></textarea>
        </div>
        <button @click="saveSalary">Creee</button>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { onMounted, computed } from 'vue'
import { useSalaryStore } from '@/stores';
import { useUserStore } from '@/stores';

const salaryStore = useSalaryStore()
const userStore = useUserStore()

const fk_user = ref(0)
const label = ref("Salaire")
const date_debut = ref()
const date_fin = ref()
const amount = ref(0)
const note_private = ref("")



const saveSalary = () => {
  const errors = [];

  if (fk_user.value <= 0) errors.push("Utilisateur");
  if (!label.value.trim()) errors.push("Libellé");
  if (!date_debut.value) errors.push("Date de début");
  if (!date_fin.value) errors.push("Date de fin");
  if (amount.value <= 0) errors.push("Montant");

  if (errors.length) {
    alert("Les champs suivants sont obligatoires :\n\n" + errors.join("\n"));
    return;
  }

  if (new Date(date_fin.value) < new Date(date_debut.value)) {
    alert("La date de fin doit être supérieure ou égale à la date de début.");
    return;
  }

  salaryStore.saveSalary(
    fk_user.value,
    label.value,
    date_debut.value,
    date_fin.value,
    amount.value,
    note_private.value
  );
};

const users = computed(() => userStore.items)
onMounted(() => {
  userStore.fetchUser()
})

</script>