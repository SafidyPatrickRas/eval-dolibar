<template>
    <div>
        <div v-if="salaryStore.loading">
            Chargement
        </div>
        <div v-else-if="salary">
            <p>Ref : {{ salary.id }} </p>
            <p>Libellé : {{ salary.label }} </p>
            <p>Date début : {{ salaryStore.timeStampToDate(salary.dateep) }} </p>
            <p>Date fin : {{ salaryStore.timeStampToDate(salary.datesp) }} </p>
            <div>
                <div>
                    <label for="date">Date</label>
                    <input type="date" v-model="selectedDate">

                    <select v-model="selectedHour">
                        <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                    </select>

                    <select v-model="selectedMinute">
                        <option v-for="minute in minutes" :key="minute" :value="minute">{{ minute }}</option>
                    </select>
                </div>
                <div>
                    <label for="">Model de reglement</label>
                    <select v-model="form.fk_typepayment">
                        <option v-for="type_payment in type_payments" :key="type_payment.id" :value="type_payment.code">
                            {{ type_payment.label }}
                        </option>
                    </select>
                </div>
                <div>
                    <label for="">Compte à débiter : </label>
                    <select v-model="form.fk_account">
                        <option v-for="bankaccount in bankaccounts" :key="bankaccount.id" :value="bankaccount.id">
                            {{ bankaccount.ref }}
                        </option>
                    </select>
                </div>
            </div>
            <hr>
            <div>
                <table border="1">
                    <tr>
                        <td>Date fin</td>
                        <td>Montant</td>
                        <td>Déjà réglé</td>
                        <td>Reste à payer</td>
                        <td>Montant</td>
                    </tr>
                    <tr>
                        <td>{{ salaryStore.timeStampToDate(salary.dateep) }}</td>
                        <td>{{ salaryStore.getAmountFormated(salary.amount) }}</td>
                        <td>{{ salaryStore.getAmountFormated(totalAlreadyPayed) }}</td>
                        <td> {{ salaryStore.getAmountFormated(Number(salary.amount) - totalAlreadyPayed) }} </td>
                        <td><input type="number" name="" id="" v-model="form.amount"></td>
                    </tr>
                </table>
                <div>
                    <button @click="goToPaye">Payer</button>
                    <button> <router-link :to="{ name: 'front.salaries.details', params: { id: salaryId } }">
                            Alluler
                        </router-link> </button>
                </div>
            </div>
        </div>
        <h1>Creation de payement sur un salaire</h1>
    </div>
</template>
<script setup>

import { onMounted, computed, ref, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useSalaryStore, useTypePayementStore, useBankaccountStore, usePaymentStore } from '@/stores';

const salaryStore = useSalaryStore()
const typePaymentStore = useTypePayementStore()
const bankaccountStore = useBankaccountStore()
const paymentStore = usePaymentStore()

const salary = ref(null)
const salaryId = ref(null);
const salaryPayements = ref(null);
const selectedDate = ref('');
const selectedHour = ref('00');
const selectedMinute = ref('00');

const restPaye = computed(() => {
    return Number(salary.value?.amount || 0) - totalAlreadyPayed.value;
});

const route = useRoute()

const type_payments = computed(() => typePaymentStore.items)
const bankaccounts = computed(() => bankaccountStore.items)


const form = reactive({
    amount: 0,
    datepaye: 0,
    fk_typepayment: null, // Initialisez à null
    paiementtype : null,
    fk_user_author: 1,
    fk_account: null      // Initialisez à null
});

const goToPaye = async () => {
    // 1. Validation : Vérifier si la date est saisie
    if (!selectedDate.value) {
        alert("Veuillez sélectionner une date.");
        return;
    }

    // 2. Création de la chaîne de caractères ISO (ex: "2026-06-29T14:30:00")
    const dateString = `${selectedDate.value}T${selectedHour.value}:${selectedMinute.value}:00`;
    
    // 3. Conversion en timestamp Unix (secondes)
    const timestamp = Math.floor(new Date(dateString).getTime() / 1000);
    
    const id = Number(salaryId.value);
    const montant = Number(form.amount);

    const payload = {
        "chid": id,
        "datepaye": timestamp,
        "paiementtype": form.fk_typepayment, 
        "label": "Paiement salaire " + id,
        "amounts": {
            [id]: montant
        },
        "fk_account": Number(form.fk_account),
        "accountid": Number(form.fk_account),
        "amount": montant
    };

    console.log("Payload envoyé :", payload);

    try {
        await paymentStore.createPayement(id, payload);
        alert("Paiement effectué avec succès !");
    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur: " + (error.response?.data?.message || "Erreur inconnue"));
    }
};
onMounted(async () => {
    salaryId.value = route.params.id;
    salary.value = await salaryStore.fetchSalaryById(salaryId.value);
    salaryPayements.value = await salaryStore.fetchPayementForSalary(salaryId.value);
    typePaymentStore.fetchAll()
    bankaccountStore.fetchBankaccount()

    // Utiliser la virgule pour afficher l'objet dans la console du navigateur
    console.log("Données du salaire reçues :", salary.value);
});

const totalAlreadyPayed = computed(() => {
    if (!salaryPayements.value) return 0;
    return salaryPayements.value.reduce(
        (total, item) => total + Number(item.amount || 0),
        0
    );
});
const hours = computed(() => {
    return Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, '0')
    );
});

const minutes = computed(() => {
    return Array.from({ length: 60 }, (_, i) =>
        i.toString().padStart(2, '0')
    );
});


</script>