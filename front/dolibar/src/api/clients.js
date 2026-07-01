// Exemple: création d'un client supplémentaire et d'une map de clients
import { createApiClient, createClients } from './axiosInstance'

const otherApiConfig = {
  baseURL: 'https://api2.example.com',
  wsKey: 'OTHER_WS_KEY', // remplacez par votre clé
  timeout: 15000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
}

// Client prêt à l'emploi
const otherApi = createApiClient(otherApiConfig)

// Map de clients nommés (peut contenir plusieurs sources)
const clients = createClients({
  default: {}, // utilise les valeurs par défaut (API_URL, WS_KEY)
  other: otherApiConfig,
})

const springConfig = {
  // On pointe vers l'URL de base de tes controllers Spring Boot (/api/colors, /api/groups, etc.)
  baseURL: 'http://localhost:8081/api', 
  timeout: 10000, // 10 secondes d'attente max
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}
const springApi = createApiClient(springConfig)

// ----- GLPI client -----
const glpiConfig = {
  // use relative path so Vite dev proxy forwards requests to localhost:8080
  baseURL: '/apirest.php',
  timeout: 20000,
  // mettre app_token en paramètre (si vous préférez l'envoyer en headers, il est aussi ajouté ci-dessous)
  params: { app_token: '4qDADqV3W0UaJ38ptPVJA3x1qTnU8lUUen1ZmgcM' },
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // Session-Token requis par l'API GLPI
    'Session-Token': 'd2JnOVdpb29pQVV0NTFVKzNxS2VjSjd4bGVQM3RKUlA1TWdkNWkrN2VYeklXRWJqOFFZdDBTZHJnak9ZTUpHZEc1cnY1Y2k2RVFwMWI4dm5iUU5sSFo3ZEVtaWtXazh5',
    // Ajout de App-Token en header pour compatibilité GLPI
    'App-Token': '4qDADqV3W0UaJ38ptPVJA3x1qTnU8lUUen1ZmgcM',
  },
}

const glpiApi = createApiClient(glpiConfig)


const dolibarConfig = {
    baseURL : 'http://localhost/dolibarr-23.0.3/htdocs/api/index.php',
    timeout: 20000,
    headers:{
        Accept : 'application/json',
        'Content-Type': 'application/json',
        'DOLAPIKEY' : 'lVQ807RUIc54rl4BpbuL5qp7xV5oFSQ4'
    }
}

const dolibarApi = createApiClient(dolibarConfig)

// Ajout du client GLPI à la map de clients (stocke l'instance)
clients.glpi = glpiApi
clients.spring = springApi

export { glpiApi }
export { clients }
export { springApi }
export { dolibarApi }

export { otherApi }
export default glpiApi
