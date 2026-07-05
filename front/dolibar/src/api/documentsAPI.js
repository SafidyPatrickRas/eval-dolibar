import { dolibarApi } from './clients'

const RESOURCE = 'documents'

export const documentsAPI = {
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

  async getById(id, config = {}) {
    try {
      const response = await dolibarApi.get(`${RESOURCE}/${id}`, {
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

  async create(data, config = {}) {
    try {
      const response = await dolibarApi.post(`${RESOURCE}/upload`, data, {
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
