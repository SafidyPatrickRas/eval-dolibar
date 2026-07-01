<template>
    <div>
        <h1>Détails d'un salaire</h1>
        <div>
            <p> <router-link :to="{ name: 'front.salaries' }">
                    Retour a la list
                </router-link> </p>
        </div>
        <div v-if="salaryStore.loading">
            Chargement en cours...
        </div>

        <div v-else-if="salary">
            <div>
                <router-link :to="{ name: 'front.salaries.payement.form', params: { id: salary.id } }">
                    Créer un paiement
                </router-link>
                <p>Date de début : {{ salaryStore.timeStampToDate(salary.dateep) }}</p>
                <p>Date de fin : {{ salaryStore.timeStampToDate(salary.datesp) }}</p>
                <p>Montant : {{ salaryStore.getAmountFormated(salary.amount) }}</p>
                <p>Mode de règlement : {{ salary.type_payment }}</p>
            </div>
            <div v-if="salaryStore.loading">
                Chargement des payement en cours
            </div>
            <div v-else-if="salaryPayements">
                <h2>Payement</h2>
                <table border="1">
                    <tr>
                        <th>Réf. paiement</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Compte bancaire	</th>
                        <th>Montant</th>
                    </tr>
                    <tr v-for="salaryPayement in salaryPayements" :key="salaryPayement.id">
                        <td>{{ salaryPayement.ref }}</td>
                        <td>{{ salaryStore.timeStampToDate(salaryPayement.datepaye)  }}</td>
                        <td>{{ salaryPayement.type_label }}</td>
                        <td>{{ salaryPayement.ref }}</td>
                        <td>{{ salaryStore.getAmountFormated(salaryPayement.amount) }}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Déjà réglé</td>
                        <td> {{ salaryStore.getAmountFormated(alreadyPayed()) }}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Montant réclamé :	</td>
                        <td>{{ salaryStore.getAmountFormated(salary.amount) }}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Reste à payer :	</td>
                        <td> {{ salaryStore.getAmountFormated(Number(salary.amount)  -  Number(alreadyPayed()))}} </td>
                    </tr>
                </table>
            </div>

        </div>


        <div v-else>
            Aucune donnée trouvée.
        </div>
    </div>
</template>
<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSalaryStore } from '@/stores';

const salaryStore = useSalaryStore()
const salary = ref(null)

const route = useRoute()
const salaryId = ref(null);
const salaryPayements = ref(null);

watch(salaryPayements , ()=>{
    console.log(salaryPayements.value)  
})

const alreadyPayed = ()=>{
    return salaryPayements.value.reduce(
  (total, item) => total + Number(item.amount || 0),
  0
);
}


onMounted(async () => {
    salaryId.value = route.params.id;
    salary.value = await salaryStore.fetchSalaryById(salaryId.value);
    salaryPayements.value = await salaryStore.fetchPayementForSalary(salaryId.value);

    // Utiliser la virgule pour afficher l'objet dans la console du navigateur
    console.log("Données du salaire reçues :", salary.value);
});
</script>