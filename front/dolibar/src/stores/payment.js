import { defineStore } from 'pinia'

import { paymentAPI } from '@/api'
import { dolibarApi } from '@/api/clients'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    items: [],
    loading: false,
    error: '',
  }),

  actions: {
    async fetchPayment(options = {}) {
      this.loading = true
      this.error = ''

      try {
        const response = await paymentAPI.getAll(options)
        // Normaliser si l'API retourne un wrapper
        if (response && Array.isArray(response.payments)) {
          this.items = response.payments
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
    // Dans votre store/payment.js
async createPayement(id_salaire,          ) {
  this.loading = true;
  try {
    const response = await dolibarApi.post(`/salaries/${id_salaire}/payments`, form);
    return response.data; // Succès
  } catch (error) {
    if (error.response) {
        console.error("Erreur HTTP:", error.response.status);
        console.error("Données complètes:", error.response.data); // C'est ici que Dolibarr mettra l'erreur réelle
        alert("Erreur Dolibarr: " + JSON.stringify(error.response.data));
    }
  } finally {
    this.loading = false;
  }
}
  },
})
