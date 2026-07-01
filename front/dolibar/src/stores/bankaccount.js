import { defineStore } from 'pinia'

import { bankaccountAPI } from '@/api'

export const useBankaccountStore = defineStore('bankaccount', {
  state: () => ({
    items: [],
    loading: false,
    error: '',
  }),

  actions: {
    async fetchBankaccountById(){
       this.loading = true;
        this.error = '';
        try {
          const response = await bankaccountAPI.getById(id);
          
          // Si l'API renvoie { data: { ... } } ou directement { ... }
          // Ajustez selon la structure réelle de votre réponse Axios
          const bankaccountData = response.data || response; 
          
          return bankaccountData;
        } catch (error) {
          this.error = error.response?.data?.error?.message || 'Erreur lors du chargement';
          return null;
        } finally {
          this.loading = false;
        }
    },
    async fetchBankaccount(options = {}) {
      this.loading = true
      this.error = ''

      try {
        const response = await bankaccountAPI.getAll(options)
        // Normaliser si l'API retourne un wrapper
        if (response && Array.isArray(response.bankaccounts)) {
          this.items = response.bankaccounts
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
  },
})
