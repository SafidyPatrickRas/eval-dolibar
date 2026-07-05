import { defineStore } from "pinia";

import { documentsAPI } from "@/api";

export const useDocumentsStore = defineStore("documents", {
  state: () => ({
    items: [],
    loading: false,
    error: "",
  }),

  actions: {
    async save(data) {
      this.loading = true;
      this.error = "";

      try {
        const response = await documentsAPI.create(data)
        console.log("document saugvarder avec succes")
        return response
      } catch (error) {
        if (error.response) {
          console.error("Erreur HTTP:", error.response.status);
          console.error("Données complètes:", error.response.data); // C'est ici que Dolibarr mettra l'erreur réelle
          alert("Erreur Dolibarr: " + JSON.stringify(error.response.data));
        }
      } finally {
        this.loading = false;
      }
    },
    async fetchDocuments(options = {}) {
      this.loading = true;
      this.error = "";

      try {
        const response = await documentsAPI.getAll(options);
        // Normaliser si l'API retourne un wrapper
        if (response && Array.isArray(response.document)) {
          this.items = response.document;
        } else if (Array.isArray(response)) {
          this.items = response;
        } else {
          this.items = [];
        }
      } catch (error) {
        this.error = (error && error.message) || "Erreur lors du chargement";
      } finally {
        this.loading = false;
      }
    },
  },
});
