#!/bin/bash

# Script de création de CRUD (API + Store)
# Utilisation: ./create-crud.sh <nom> <cle_json> <url_api>
# Exemple: ./create-crud.sh zone zones /api/zones
#          ./create-crud.sh product products /api/products

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Vérifier les paramètres
if [ $# -ne 3 ]; then
  echo -e "${RED}❌ Erreur: 3 paramètres requis${NC}"
  echo ""
  echo "Utilisation: ./create-crud.sh <nom> <cle_json> <url_api>"
  echo ""
  echo "Paramètres:"
  echo "  <nom>       : Nom du CRUD (ex: zone, product, order)"
  echo "  <cle_json>  : Nom de la clé JSON retournée (ex: zones, products, orders)"
  echo "  <url_api>   : URL de l'API (ex: /api/zones, /api/products)"
  echo ""
  echo "Exemple:"
  echo "  ./create-crud.sh zone zones /api/zones"
  echo "  ./create-crud.sh product products /api/products"
  exit 1
fi

NAME=$1
JSON_KEY=$2
API_URL=$3

# Enlever le /api/ du début de l'URL ou le slash initial, pour obtenir la ressource relative
# Ex: /api/countries → countries, /products → products, /Group → Group
RESOURCE=$(echo "$API_URL" | sed -E 's|^/api/||; s|^/||')

# Calculer les noms normalisés (supporte multi-mots: snake_case, kebab-case, espaces)
# Ex: order_states, order-states, "order states"
NAME_RAW="$NAME"
# Split on - _ or space
IFS='-_ ' read -r -a _parts <<< "$NAME_RAW"
for i in "${!_parts[@]}"; do
  _parts[$i]=$(echo "${_parts[$i]}" | tr '[:upper:]' '[:lower:]')
done
# PascalCase (OrderStates)
PASCAL=''
for p in "${_parts[@]}"; do
  PASCAL+="$(echo "${p:0:1}" | tr '[:lower:]' '[:upper:]')${p:1}"
done
# camelCase (orderStates)
CAMEL=$(echo "${PASCAL:0:1}" | tr '[:upper:]' '[:lower:]')${PASCAL:1}

API_EXPORT="${CAMEL}API"
FIRST_LETTER_UPPER="$PASCAL"
STORE_NAME="use${PASCAL}Store"
FETCH_ACTION="fetch${PASCAL}"

echo -e "${YELLOW}🚀 Création du CRUD: $NAME${NC}"
echo "  - Clé JSON: $JSON_KEY"
echo "  - Ressource API: $RESOURCE"
echo "  - API Export: $API_EXPORT"
echo "  - Store: $STORE_NAME"
echo "  - Action: $FETCH_ACTION"
echo ""

# Répertoires
API_DIR="src/api"
STORES_DIR="src/stores"

# Vérifier que les répertoires existent
if [ ! -d "$API_DIR" ]; then
  echo -e "${RED}❌ Répertoire $API_DIR n'existe pas${NC}"
  exit 1
fi

if [ ! -d "$STORES_DIR" ]; then
  echo -e "${RED}❌ Répertoire $STORES_DIR n'existe pas${NC}"
  exit 1
fi

# ========================================
# CRÉER LE FICHIER API
# ========================================
API_FILE_PATH="$API_DIR/${API_EXPORT}.js"

if [ -f "$API_FILE_PATH" ]; then
  echo -e "${YELLOW}⚠️  $API_FILE_PATH existe déjà - passage${NC}"
else
  cat > "$API_FILE_PATH" << EOF
import axiosInstance from './axiosInstance'

const RESOURCE = '$RESOURCE'

export const ${API_EXPORT} = {
  async getAll(options = {}, config = {}) {
    try {
      const response = await axiosInstance.get(RESOURCE, {
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
      const response = await axiosInstance.get(\`\${RESOURCE}/\${id}\`, {
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
      const response = await axiosInstance.post(RESOURCE, data, {
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
      const response = await axiosInstance.put(\`\${RESOURCE}/\${id}\`, data, {
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
      const response = await axiosInstance.delete(\`\${RESOURCE}/\${id}\`, {
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
EOF

  echo -e "${GREEN}✅ Créé: $API_FILE_PATH${NC}"
fi

# ========================================
# AJOUTER EXPORT DANS api/index.js
# ========================================
API_INDEX="$API_DIR/index.js"

if [ -f "$API_INDEX" ]; then
  EXPORT_LINE="export { ${API_EXPORT} } from './${API_EXPORT}'"
  
  if grep -q "${API_EXPORT}" "$API_INDEX"; then
    echo -e "${YELLOW}⚠️  ${API_EXPORT} déjà exporté dans index.js${NC}"
  else
    echo "$EXPORT_LINE" >> "$API_INDEX"
    echo -e "${GREEN}✅ Ajouté export dans: $API_INDEX${NC}"
  fi
else
  echo -e "${RED}❌ Fichier $API_INDEX n'existe pas${NC}"
  exit 1
fi

# ========================================
# CRÉER LE FICHIER STORE
# ========================================
STORE_FILE_PATH="$STORES_DIR/${NAME}.js"

if [ -f "$STORE_FILE_PATH" ]; then
  echo -e "${YELLOW}⚠️  $STORE_FILE_PATH existe déjà - passage${NC}"
else
  cat > "$STORE_FILE_PATH" << EOF
import { defineStore } from 'pinia'

import { ${API_EXPORT} } from '@/api'

export const ${STORE_NAME} = defineStore('${NAME}', {
  state: () => ({
    items: [],
    loading: false,
    error: '',
  }),

  actions: {
    async ${FETCH_ACTION}(options = {}) {
      this.loading = true
      this.error = ''

      try {
        const response = await ${API_EXPORT}.getAll(options)
        // Normaliser si l'API retourne un wrapper
        if (response && Array.isArray(response.${JSON_KEY})) {
          this.items = response.${JSON_KEY}
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
  },
})
EOF

  echo -e "${GREEN}✅ Créé: $STORE_FILE_PATH${NC}"
fi

# ========================================
# AJOUTER EXPORT DANS stores/index.js
# ========================================
STORES_INDEX="$STORES_DIR/index.js"

if [ -f "$STORES_INDEX" ]; then
  EXPORT_LINE="export { ${STORE_NAME} } from './${NAME}'"
  
  if grep -q "${STORE_NAME}" "$STORES_INDEX"; then
    echo -e "${YELLOW}⚠️  ${STORE_NAME} déjà exporté dans index.js${NC}"
  else
    echo "$EXPORT_LINE" >> "$STORES_INDEX"
    echo -e "${GREEN}✅ Ajouté export dans: $STORES_INDEX${NC}"
  fi
else
  echo -e "${RED}❌ Fichier $STORES_INDEX n'existe pas${NC}"
  exit 1
fi

# ========================================
# CRÉER LE RÉPERTOIRE ET FICHIER VUE
# ========================================
VIEWS_DIR="src/views/${NAME}"

if [ ! -d "$VIEWS_DIR" ]; then
  mkdir -p "$VIEWS_DIR"
  echo -e "${GREEN}✅ Répertoire créé: $VIEWS_DIR${NC}"
fi

VIEW_FILE_PATH="$VIEWS_DIR/${FIRST_LETTER_UPPER}View.vue"

if [ -f "$VIEW_FILE_PATH" ]; then
  echo -e "${YELLOW}⚠️  $VIEW_FILE_PATH existe déjà - passage${NC}"
else
  cat > "$VIEW_FILE_PATH" << EOF
<template>
  <div>
    <h1>${FIRST_LETTER_UPPER}</h1>
    nombre {{ items.length }}
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.id }} </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { ${STORE_NAME} } from '@/stores'

const store = ${STORE_NAME}()
const items = computed(() => store.items)

onMounted(() => {
  store.${FETCH_ACTION}()
})
</script>
EOF

  echo -e "${GREEN}✅ Créé: $VIEW_FILE_PATH${NC}"
fi

# ========================================
# AJOUTER LA ROUTE DANS LE ROUTEUR
# ========================================
ROUTER_FILE="src/router/index.js"

if [ -f "$ROUTER_FILE" ]; then
  # Vérifier si la route existe déjà
  if grep -q "path: '/${NAME}s'" "$ROUTER_FILE"; then
    echo -e "${YELLOW}⚠️  Route /${NAME}s déjà présente dans router${NC}"
  else
    # Créer un fichier Python temporaire pour insérer les routes
    python3 << PYTHON_EOF
import re

router_file = '$ROUTER_FILE'
name = '$NAME'
first_upper = '${FIRST_LETTER_UPPER}'

route_block = f'''  /**
   * ============================================
   * 📁 ROUTES {name.upper()}
   * ============================================
   */

  {{
    path: '/{name}s',
    name: '{first_upper}s',
    component: () => import('@/views/{name}/{first_upper}View.vue'),
    meta: {{
      title: '{first_upper}s',
      description: 'Liste des {name}s',
    }},
  }},

'''

with open(router_file, 'r') as f:
    content = f.read()

# Trouver le commentaire "ROUTE ERREUR 404" et insérer avant
pattern = r'(  /\*\*\n   \* ={40,}\n   \* 📁 ROUTE ERREUR 404)'
replacement = route_block + r'\1'
new_content = re.sub(pattern, replacement, content)

with open(router_file, 'w') as f:
    f.write(new_content)

print("✓ Route insérée")
PYTHON_EOF

    echo -e "${GREEN}✅ Route ajoutée dans: $ROUTER_FILE${NC}"
  fi
else
  echo -e "${RED}❌ Fichier $ROUTER_FILE n'existe pas${NC}"
  exit 1
fi

# ========================================
# RÉSUMÉ FINAL
# ========================================
echo ""
echo -e "${GREEN}✨ CRUD créé avec succès!${NC}"
echo ""
echo "📁 Fichiers créés/modifiés:"
echo "  - $API_FILE_PATH"
echo "  - $API_INDEX"
echo "  - $STORE_FILE_PATH"
echo "  - $STORES_INDEX"
echo "  - $VIEW_FILE_PATH"
echo "  - $ROUTER_FILE"
echo ""
echo "🌐 Route disponible:"
echo "  http://localhost:5173/${NAME}s"
echo ""
echo "📝 Utilisation dans un composant:"
echo "  import { ${STORE_NAME} } from '@/stores'"
echo "  const store = ${STORE_NAME}()"
echo "  await store.${FETCH_ACTION}()"
echo ""
