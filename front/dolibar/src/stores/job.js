import { defineStore } from 'pinia'

import { jobAPI } from '@/api'

export const useJobStore = defineStore('job', {
  state: () => ({
    items: [],
    loading: false,
    error: '',
  }),

  actions: {
    async fetchJobById(id){
      this.loading = true;
      this.error = '';

      try {
        const response = await jobAPI.getById(id);
        const jobData = response.data || response; 
        
        return jobData;
      } catch (error) {
         this.error = error.response?.data?.error?.message || 'Erreur lors du chargement';
        return null;
      }finally {
        this.loading = false;
      }
    },
    async fetchJob(options = {}) {
      this.loading = true
      this.error = ''

      try {
        const response = await jobAPI.getAll(options)
        // Normaliser si l'API retourne un wrapper
        if (response && Array.isArray(response.jobs)) {
          this.items = response.jobs
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
