```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // --- GROUPE FRONT ---
    {
      path: '/index',
      name: 'front.index',
      component: () => import('@/views/index.vue'),
      meta: { layout: 'front' }
    },

    // --- GROUPE BACK (Admin) ---
    {
      path: '/admin',
      name: 'back.dashboard',
      component: () => import('@/views/admin/Dashboard.vue'),
      meta: { layout: 'back' }
    },
    // Route avec paramètre dynamique (ex: /admin/user/5)
    {
      path: '/admin/user/:id',
      name: 'back.user.details',
      component: () => import('@/views/admin/UserDetails.vue'),
      props: true, // Permet de recevoir ':id' comme une 'prop' dans le composant
      meta: { layout: 'back' }
    }
  ]
})


const routes = [
  {
    path: '/index',
    name: 'front.index',
    component: () => import('@/views/IndexParent.vue'), // Le composant parent
    meta: { layout: 'front' },
    children: [
      {
        path: '', // Route vide : affichée par défaut quand on va sur /index
        name: 'front.index.home',
        component: () => import('@/views/index/Dashboard.vue')
      },
      {
        path: 'settings', // Devient /index/settings
        name: 'front.index.settings',
        component: () => import('@/views/index/Settings.vue')
      }
    ]
  }
]


router.push({ name: 'back.users', query: { sort: 'asc', page: 2 } })


<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.query.sort) // Affiche 'asc'
</script>

```