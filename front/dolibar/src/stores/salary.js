import {
  defineStore
} from 'pinia'

import { usePaymentStore } from './payment'

import {
  salaryAPI
} from '@/api'

export const useSalaryStore = defineStore('salary', {
  state: () => ({
    items: [],
    loading: false,
    error: '',
    statuts: {}
  }),

  actions: {
    getAmountFormated(amount){
      return "" + Number(amount).toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) 
    },
    timeStampToDate(timestamp){
      return new Date(timestamp * 1000).toLocaleDateString("fr-FR") 
    },
    dateToTimestamp(dateString, isEnd = false) {
    if (!dateString) return null;

    let year, month, day;

    // Détection du format : si contient '-', c'est le formulaire (YYYY-MM-DD)
    if (dateString.includes('-')) {
        [year, month, day] = dateString.split('-').map(Number);
    } 
    // Sinon, on suppose le format CSV (DD/MM/YYYY)
    else if (dateString.includes('/')) {
        [day, month, year] = dateString.split('/').map(Number);
    } else {
        return null;
    }

    // Création de la date (le mois est base 0 en JS)
    const date = new Date(year, month - 1, day);

    if (isEnd) {
        date.setHours(23, 59, 59);
    }

    return Math.floor(date.getTime() / 1000);
},
async calculateAllStatuts() {
    const paymentStore = usePaymentStore();
    
    // On s'assure d'avoir tous les paiements une seule fois
    if (paymentStore.items.length === 0) {
      await paymentStore.fetchPayment();
    }

    // On parcourt les salaires déjà en mémoire
    for (const item of this.items) {
      // Filtrage local (très rapide)
      const paiementsDuSalaire = paymentStore.items.filter(p => Number(p.fk_salary) === Number(item.id));
      
      const totalPayer = paiementsDuSalaire.reduce(
        (total, p) => total + Number(p.amount || 0), 0
      );

      const montant = Number(item.amount || 0);

      // Calcul local
      if (totalPayer <= 0) this.statuts[item.id] = "Impayé";
      else if (montant - totalPayer > 0) this.statuts[item.id] = "Règlement commencé";
      else this.statuts[item.id] = "Paiement effectué";
    }
  },
    async fetchPayementForSalary(id) {
  const payementStore = usePaymentStore();
  
  // Optimisation : On ne fetch que si le store est vide
  if (payementStore.items.length === 0) {
    await payementStore.fetchPayment();
  }

  // Utiliser filter si vous prévoyez plusieurs paiements (acomptes + solde)
  return payementStore.items.filter(item => Number(item.fk_salary) === Number(id));
},
    async fetchSalaryById(id) {
  this.loading = true;
  this.error = '';
  try {
    const response = await salaryAPI.getById(id);
    
    // Si l'API renvoie { data: { ... } } ou directement { ... }
    // Ajustez selon la structure réelle de votre réponse Axios
    const salaryData = response.data || response; 
    
    return salaryData;
  } catch (error) {
    this.error = error.response?.data?.error?.message || 'Erreur lors du chargement';
    return null;
  } finally {
    this.loading = false;
  }
},
    
    async fetchSalary(options = {}) {
      this.loading = true
      this.error = ''

      try {
        const response = await salaryAPI.getAll(options)
        // Normaliser si l'API retourne un wrapper
        if (response && Array.isArray(response.salaries)) {
          this.items = response.salaries
        } else if (Array.isArray(response)) {
          this.items = response
        } else {
          this.items = []
        }
      } catch (error) {
        this.error = (error && error.message) || 'Erreur lors du chargement'
      } finally {
        this.loading = false
      }
    },
    async saveSalary(fk_user, label, date_debut, date_fin, amount, note_private) {
      this.loading = true
      this.error = ''

      try {

        const payload = {
          fk_user: fk_user,
          label: label,
          datesp: this.dateToTimestamp(date_debut),
          dateep: this.dateToTimestamp(date_fin , true),
          amount: amount,
          note_private: note_private,
          type_payment : 4
        };

        console.log("========== PAYLOAD SALAIRE ==========");
        console.log("Payload envoyé :", JSON.stringify(payload, null, 2));
        console.log("=====================================");


        // On stocke la réponse
    // ... après le await salaryAPI.create(payload)
// Dans votre fonction saveSalary
// ... après le await salaryAPI.create(payload)
const response = await salaryAPI.create(payload);

// La réponse EST directement l'ID (le nombre)
const newId = response; 

console.log("Salaire créé avec succès, ID reçu :", newId);
return newId; // On retourne le nombre directement
      } 
      catch (error) {

  console.error("========== ERREUR API ==========");
  console.error("Message :", error.message);

  if (error.response) {
    console.error("Status :", error.response.status);
    console.error("Status Text :", error.response.statusText);
    console.error("Headers :", error.response.headers);
    console.error("Data :", error.response.data);
  } else if (error.request) {
    console.error("Aucune réponse reçue :", error.request);
  } else {
    console.error("Erreur Axios :", error);
  }

  this.error =
    error.response?.data?.error?.message ||
    error.response?.data?.error ||
    error.response?.data?.message ||
    JSON.stringify(error.response?.data) ||
    error.message ||
    "Erreur lors de la création de salaire";

} finally {
  this.loading = false;
}
    },
    

  },
})