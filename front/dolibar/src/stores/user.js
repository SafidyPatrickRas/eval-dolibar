import { defineStore } from 'pinia'

import { userAPI } from '@/api'

import bcrypt from 'bcryptjs';
import router from '@/router/index.js'; // 1. Importez useRouter

export const useUserStore = defineStore('user', {
  state: () => ({
    items: [],
    loading: false,
    error: '',
  }),

  actions: {
    goToLogin(id_user){
      localStorage.setItem("id_user_logined" , id_user)
      router.push({ name: 'back.index' });
    },
    goToLogOut(){
      localStorage.removeItem("id_user_logined")
      router.push({ name: 'back' });
    },
    async fetchUserById(id){
      this.loading = true
      this.error = ''
      let user = null

      try {
        const response = await userAPI.getById(id)
        // Normaliser si l'API retourne un wrapper
        if (response && Array.isArray(response.users)) {
          user = response.users
        } else if (Array.isArray(response)) {
          user = response
        } else {
          user = null
        }
      } catch (error) {
        this.error = (error && error.message) || 'Erreur lors du chargement'
      } finally {
        this.loading = false
      }

      return user
    },
    async fetchUser(options = {}) {
      this.loading = true
      this.error = ''

      try {
        const response = await userAPI.getAll(options)
        // Normaliser si l'API retourne un wrapper
        if (response && Array.isArray(response.users)) {
          this.items = response.users
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

    async saveUser(data) {
    const clearPassword = data.password;
  
    // 2. Préparation du payload avec les champs de sécurité Dolibarr
    const securePayload = {
        ...data,     // On précise la méthode
    };
    
    // 3. Suppression du mot de passe en clair pour la sécurité
    delete securePayload.password;

    try {
        console.log("Envoi du payload sécurisé :", securePayload);
        const response = await userAPI.create(securePayload);
        return response.data;
    } catch (error) {
        console.error("Erreur API :", error.response?.data || error);
        throw error;
    }
}
  },
})
