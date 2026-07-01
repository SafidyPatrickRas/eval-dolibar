import { dolibarApi } from './clients'

const RESOURCE = 'users'

export const userAPI = {
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
      const response = await dolibarApi.post(RESOURCE, data, {
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

  async update(id, data, config = {}) {
    try {
      const response = await dolibarApi.put(`${RESOURCE}/${id}`, data, {
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
