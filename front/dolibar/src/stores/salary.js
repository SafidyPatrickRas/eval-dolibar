import { defineStore } from "pinia";

import { usePaymentStore } from "./payment";

import { salaryAPI } from "@/api";

export const useSalaryStore = defineStore("salary", {
  state: () => ({
    items: [],
    loading: false,
    error: "",
    statuts: {},
  }),

  actions: {
    getSalaryAmountForMonth(salary, month, year) {
      const salaryStart = new Date(salary.datesp * 1000);
      const salaryEnd = new Date(salary.dateep * 1000);

      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0, 23, 59, 59);

      const effectiveStart = new Date(Math.max(salaryStart, monthStart));
      const effectiveEnd = new Date(Math.min(salaryEnd, monthEnd));

      if (effectiveStart > effectiveEnd) {
        return 0;
      }

      const dailySalary = this.getDailySalary(
        salary.amount,
        salaryStart,
        salaryEnd,
      );

      const workedDays = getPeriodDays(effectiveStart, effectiveEnd);

      return workedDays * dailySalary;
    },
    getDailySalary(amount, startDate, endDate) {
      const totalDays = getPeriodDays(startDate, endDate);

      return Number(amount) / totalDays;
    },
    // calcule le nombre de jours
    getPeriodDays(startDate, endDate) {
      const ONE_DAY = 1000 * 60 * 60 * 24;

      return Math.floor((endDate - startDate) / ONE_DAY) + 1;
    },
    async getSalaryForMonth(salaryId, month, year) {
      const salary = await this.fetchSalaryById(salaryId);

      // 1. Conversion des timestamps en objets Date JS
      const salaryStart = new Date(salary.datesp * 1000);
      const salaryEnd = new Date(salary.dateep * 1000);

      // 2. Définir les limites du mois demandé
      // month est indexé à 0 en JS (0 = Janvier, 5 = Juin)
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0, 23, 59, 59); // Dernier jour du mois

      // 3. Calcul de l'intersection
      // La date de début est le max entre le début du salaire et le début du mois
      const effectiveStart = new Date(Math.max(salaryStart, monthStart));

      // La date de fin est le min entre la fin du salaire et la fin du mois
      const effectiveEnd = new Date(Math.min(salaryEnd, monthEnd));

      // 4. Vérifier si le salaire couvre bien ce mois
      if (effectiveStart > effectiveEnd) {
        return null; // Le salaire ne couvre pas ce mois
      }

      return {
        startDate: effectiveStart,
        endDate: effectiveEnd,
      };
    },
    async fetchSalaryByUserId(id_user) {
      if (this.items.length == 0) {
        await this.fetchSalary();
      }
      return this.items.filter((item) => item.fk_user == id_user);
    },
    getAmountFormated(amount) {
      return (
        "" +
        Number(amount).toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    },
    timeStampToDate(timestamp) {
      if (!timestamp) return "";

      // Si c'est déjà une chaîne YYYY-MM-DD (format base de données)
      if (typeof timestamp === "string" && timestamp.includes("-")) {
        const [year, month, day] = timestamp.split("-");
        return `${day}/${month}/${year}`;
      }

      // Sinon, traitement classique UTC pour timestamp
      const date = new Date(timestamp * 1000);
      const day = String(date.getUTCDate()).padStart(2, "0");
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const year = date.getUTCFullYear();

      return `${day}/${month}/${year}`;
    },
    timestampToDisplayDate(timestamp) {
      if (!timestamp) return "";

      // Compensation de +1 heure (3600 secondes)
      const date = new Date((timestamp + 3600) * 1000);

      const day = String(date.getUTCDate()).padStart(2, "0");
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const year = date.getUTCFullYear();

      return `${day}/${month}/${year}`;
    },
    dateToTimestamp(dateString, isEnd = false) {
      if (!dateString) return null;

      let year, month, day;

      if (dateString.includes("-")) {
        [year, month, day] = dateString.split("-").map(Number);
      } else if (dateString.includes("/")) {
        [day, month, year] = dateString.split("/").map(Number);
      } else {
        return null;
      }

      // Utilisation de Date.UTC pour forcer l'interprétation en heure universelle
      // Cela évite que le fuseau horaire local ne décale la date de +/- quelques heures
      const date = new Date(Date.UTC(year, month - 1, day));

      if (isEnd) {
        // Si c'est une fin de journée, on définit à 23:59:59 UTC
        date.setUTCHours(23, 59, 59);
      } else {
        // Si c'est un début de journée, on s'assure d'être à 00:00:00 UTC
        date.setUTCHours(0, 0, 0);
      }

      // On retourne le timestamp en secondes (Unix)
      return Math.floor(date.getTime() / 1000);
    },
    adjustTimestamp(timestamp) {
      if (!timestamp) return null;

      // Compensation du décalage Dolibarr
      return timestamp + 3600;
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
        const paiementsDuSalaire = paymentStore.items.filter(
          (p) => Number(p.fk_salary) === Number(item.id),
        );

        const totalPayer = paiementsDuSalaire.reduce(
          (total, p) => total + Number(p.amount || 0),
          0,
        );

        const montant = Number(item.amount || 0);

        // Calcul local
        if (totalPayer <= 0) this.statuts[item.id] = "Impayé";
        else if (montant - totalPayer > 0)
          this.statuts[item.id] = "Règlement commencé";
        else this.statuts[item.id] = "Paiement effectué";
      }
    },
    async getRestPayeForSalary(salaryId) {
      const paymentStore = usePaymentStore();
      if (paymentStore.items.length === 0) {
        await paymentStore.fetchPayment();
      }
      const salary = await this.fetchSalaryById(salaryId);
      const paiementsDuSalaire = paymentStore.items.filter(
        (p) => Number(p.fk_salary) === Number(salaryId),
      );

      const totalPayer = paiementsDuSalaire.reduce(
        (total, p) => total + Number(p.amount || 0),
        0,
      );

      const montant = Number(salary.amount || 0);

      return montant - totalPayer;
    },
    async fetchPayementForSalary(id) {
      const payementStore = usePaymentStore();

      // Optimisation : On ne fetch que si le store est vide
      if (payementStore.items.length === 0) {
        await payementStore.fetchPayment();
      }

      // Utiliser filter si vous prévoyez plusieurs paiements (acomptes + solde)
      return payementStore.items.filter(
        (item) => Number(item.fk_salary) === Number(id),
      );
    },
    async fetchSalaryById(id) {
      this.loading = true;
      this.error = "";
      try {
        const response = await salaryAPI.getById(id);

        // Si l'API renvoie { data: { ... } } ou directement { ... }
        // Ajustez selon la structure réelle de votre réponse Axios
        const salaryData = response.data || response;

        return salaryData;
      } catch (error) {
        this.error =
          error.response?.data?.error?.message || "Erreur lors du chargement";
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchSalary(options = {}) {
      this.loading = true;
      this.error = "";

      try {
        const response = await salaryAPI.getAll(options);
        // Normaliser si l'API retourne un wrapper
        if (response && Array.isArray(response.salaries)) {
          this.items = response.salaries;
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
    async saveSalary(
      fk_user,
      label,
      date_debut,
      date_fin,
      amount,
      note_private,
    ) {
      this.loading = true;
      this.error = "";

      try {
        const payload = {
          fk_user: fk_user,
          label: label,
          datesp: this.dateToTimestamp(date_debut),
          dateep: this.dateToTimestamp(date_fin, true),
          amount: amount,
          note_private: note_private,
          type_payment: 4,
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
      } catch (error) {
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
});
