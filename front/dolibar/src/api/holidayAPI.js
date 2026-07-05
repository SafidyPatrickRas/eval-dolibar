import { springApi } from './clients'

const RESOURCE = 'holidays'

export const holidayAPI = {
  async getAll(options = {}, config = {}) {
    try {
      const response = await springApi.get(RESOURCE, {
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
      const response = await springApi.get(`${RESOURCE}/${id}`, {
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
      const response = await springApi.post(RESOURCE, data, {
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
      const response = await springApi.put(`${RESOURCE}/${id}`, data, {
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
      const response = await springApi.delete(`${RESOURCE}/${id}`, {
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
