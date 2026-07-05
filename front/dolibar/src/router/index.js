  import {
    createRouter,
    createWebHistory
  } from 'vue-router'

  const router = createRouter({
    history: createWebHistory(
      import.meta.env.BASE_URL),
    routes: [{
        path: '/test',
        name: 'test',
        component: () => import('@/views/back/postTest.vue'),
      },
      // Exemple de route Front
      {
        path: '/front',
        meta: {
          layout: 'front'
        }, // Définit le layout front
        children: [{
            path: '',
            name: 'front.index',
            component: () => import('@/views/front/index.vue'),
          },
          {
            path: 'salaries',
            children: [{
                path: '',
                name: 'front.salaries',
                component: () => import('@/views/salary/SalaryView.vue'),
              },
              {
                path: 'create',
                name: 'front.salaries.create',
                component: () => import('@/views/salary/CreateFormView.vue'),
              },
              {
                path: ':id',
                children: [{
                    path: '',
                    name: 'front.salaries.details',
                    component: () => import('@/views/salary/DetailsView.vue'),
                  },
                  {
                    path: 'payement',
                    children: [{
                      path: 'create',
                      name: 'front.salaries.payement.form',
                      component: () => import('@/views/payment/PayementForm.vue'),
                    }]
                  }
                ],


              },
            ]
          },
          {
            path: 'payement',
            children: [{
              path: 'multipleCreate',
              name: 'front.salaries.payement.multipleForm',
              component: () => import('@/views/payment/PayementGeneraliseForm.vue'),
            }]

          }
        ]
      },
      // Exemple de route Back
      {
        path: '/back',

        children: [{
            path: '',
            name: 'back',
            component: () => import('@/views/back/login.vue'),
            meta: {
              layout: 'other'
            },
          },
          {
            path: 'logout',
            name: 'back.logout',
            component: () => import('@/views/back/logout.vue'),
            meta: {
              layout: 'other'
            },
          },
          {
            path: 'holidays',
            children: [{
                path: '',
                name: 'back.holidays',
                component: () => import('@/views/holiday/HolidayView.vue'),
                meta: {
                  layout: 'back'
                },
              },
              {
                path: 'form',
                name: 'back.form',
                component: () => import('@/views/holiday/HolidayFormView.vue'),
                meta: {
                  layout: 'back'
                },
              },
            ],

          },
          {
            path: 'index',
            name: 'back.index',
            component: () => import('@/views/back/index.vue'),
            meta: {
              layout: 'back'
            },
          },
          {
            path: 'dashboard',
            name: 'back.dashboard',
            component: () => import('@/views/back/dashboard.vue'),
            meta: {
              layout: 'back'
            },
          },
          {
            path: 'import',
            name: 'back.import',
            component: () => import('@/views/back/import.vue'),
            meta: {
              layout: 'back'
            },
          },

          {
            path: 'reinitialisation', // Route vide : affichée par défaut quand on va sur /index
            name: 'back.reinitialisation',
            component: () => import('@/views/back/reinitialisation.vue'),
            meta: {
              layout: 'back'
            },
          },
          {
            path: 'users',
            children: [{
                path: '',
                name: 'back.users',
                component: () => import('@/views/user/UserView.vue'),
                meta: {
                  layout: 'back'
                },
              },
              {
                path: 'details/:id',
                name: 'back.users.details',
                component: () => import('@/views/user/UserDetailsView.vue'),
                meta: {
                  layout: 'back'
                },
              }

            ]
          },
          {
            path: 'jobs',
            children: [{
                path: '',
                name: 'back.jobs',
                component: () => import("@/views/job/JobView.vue"),
                meta: {
                  layout: ' back'
                }
              },
              {
                path: 'create',
                name: 'back.jobs.create',
                component: () => import("@/views/job/JobFormView.vue"),
                meta: {
                  layout: ' back'
                }
              },
            ]
          }
        ]
      }
    ]
  })

  export default router