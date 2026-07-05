import { defineStore } from "pinia";

import { holidayAPI } from "@/api";

export const useHolidayStore = defineStore("holiday", {
  state: () => ({
    items: [],
    loading: false,
    error: "",
  }),

  actions: {
    async fetchHolidayBetweenDate(dateStart, dateEnd) {

      if (this.items.length === 0) {
        await this.fetchHoliday();
      }

      const start = new Date(dateStart).getTime();
      const end = new Date(dateEnd).getTime();

      return this.items.filter((it) => {
        const holidayDate = new Date(it.date).getTime();
        return holidayDate >= start && holidayDate <= end;
      });
    },

    async save(id_holly, name, date, description) {
      this.loading = true;
      this.error = "";

      const payload = {
        name: name,
        date: date,
        description: description,
      };

      console.log("id de mis ajours : " + id_holly);

      try {
        console.log("Envoi du payload  :", payload);
        if (!id_holly) {
          const response = await holidayAPI.create(payload);
          console.log("Holly day cree avec success");
          return response.data;
        } else {
          const response = await holidayAPI.update(id_holly, payload);
          console.log("Holly day mis a jours avec success");
          return response.data;
        }
      } catch (error) {
        console.error("Erreur API :", error.response?.data || error);
        throw error;
      }
    },
    async fetchHoliday(options = {}) {
      this.loading = true;
      this.error = "";

      try {
        const response = await holidayAPI.getAll(options);
        // Normaliser si l'API retourne un wrapper
        if (response && Array.isArray(response.holidays)) {
          this.items = response.holidays;
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
    async fetchHolidayById(id) {
      this.loading = true;
      try {
        const response = await holidayAPI.getById(id);

        // LOGUEZ CECI : c'est crucial
        console.log("DEBUG API RESPONSE :", response);

        // Si l'API retourne directement l'objet { id: 1, name: "Noël", ... }
        // alors Array.isArray(response) sera FAUX.
        return response.data || response; // Ajustez selon la structure réelle
      } catch (error) {
        console.error("Erreur API :", error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    async delete(id) {
      this.loading = true;
      this.error = "";
      try {
        await holidayAPI.delete(id);
        console.log("suppresion du holly : " + id);
      } catch (error) {
        console.error("Erreur API :", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
