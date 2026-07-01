import { dolibarApi } from './clients'

const RESOURCE = 'salaries/payments' 

export const paymentAPI = {
  async getAll(options = {}, config = {}) {
    try {
      const response = await dolibarApi.get(RESOURCE, {
        params: {
          ...(config.params ?? {}),
          ...options,
        },
        ...config,
      })
      return response
    } catch (error) {
      throw error
    }
  },

  async getById(pid, config = {}) {
    try {
      const response = await dolibarApi.get(`/salaries/payments/${pid}`, {
        params: {
          ...(config.params ?? {}),
        },
        ...config,
      })
      return response
    } catch (error) {
      throw error
    }
  },

  async create(id , data, config = {}) {
    try {
      console.log("ID utilisé :", id);
console.log("Données envoyées (Payload) :", JSON.stringify(data, null, 2));
      const response = await dolibarApi.post(`/salaries/${id}/payments`, data, {
        params: {
          ...(config.params ?? {}),
        },
        ...config,
      })
      return response
    } catch (error) {
        if (error.response) {
    // Le serveur a répondu avec un code autre que 2xx
    console.log("Données reçues par l'API :", error.response.data);
    console.log("Statut :", error.response.status);
    console.error("Détails de l'erreur :", error.response.data.error || error.response.data);
  } else {
    console.error("Erreur de réseau :", error.message);
  }
    }
  },

  async update(id, data, config = {}) {
    try {
      const response = await dolibarApi.put(`/salaries/${id}/payments`, data, {
        params: {
          ...(config.params ?? {}),
        },
        ...config,
      })
      return response
    } catch (error) {
      throw error
    }
  },

  async delete(id, config = {}) {
    try {
      const response = await dolibarApi.delete(`${RESOURCE}/${id}`, {
        params: {
          ...(config.params ?? {}),
        },
        ...config,
      })
      return response
    } catch (error) {
      throw error
    }
  },
}
