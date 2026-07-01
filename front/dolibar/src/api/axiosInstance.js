import axios from 'axios'

import { API_TIMEOUT, API_URL, WS_KEY } from '@/config/api'

function createApiClient(options = {}) {
  const {
    baseURL = API_URL,
    timeout = API_TIMEOUT,
    wsKey = WS_KEY,
    headers = { Accept: 'application/xml', 'Content-Type': 'application/xml' },
    responseType = 'text',
    params = {},
  } = options

  const client = axios.create({
    baseURL,
    timeout,
    headers,
    responseType,
    params: {
      ws_key: wsKey,
      ...params,
    },
  })

  client.interceptors.request.use((config) => {
    config.params = {
      ws_key: wsKey,
      ...(config.params ?? {}),
    }

    return config
  })

  client.interceptors.response.use(
    (response) => {
      if (typeof response.data !== 'string') {
        return response.data
      }

      try {
        return JSON.parse(response.data)
      } catch {
        return response.data
      }
    },
    (error) => {
      let message = 'Erreur serveur'

      if (error.response?.status === 401) {
        message = 'Non authentifié - clé API ws_key invalide'
      } else if (error.response?.status === 403) {
        message = 'Accès refusé - permissions insuffisantes'
      } else if (error.code === 'ERR_NETWORK') {
        message = `Impossible de joindre l’API sur ${baseURL}`
      } else {
        message = error.message || 'Erreur serveur'
      }

      const normalizedError = new Error(message)
      normalizedError.status = error.response?.status
      throw normalizedError
    },
  )

  return client
}

// Default client for existing code that expects a single API instance
const defaultClient = createApiClient()

export { createApiClient }
export default defaultClient

function createClients(configs = {}) {
  const clients = {}
  Object.entries(configs).forEach(([name, opts]) => {
    clients[name] = createApiClient(opts)
  })
  return clients
}

export { createClients }