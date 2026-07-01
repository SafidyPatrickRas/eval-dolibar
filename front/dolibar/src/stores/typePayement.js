import {
    defineStore
} from 'pinia'

export const useTypePayementStore = defineStore('typePayement', {
    state: () => ({
        items: [],
        loading: false,
        error: '',
    }),

    actions: {
        fetchAll(options = {}) {
            this.loading = true
            this.error = ''

            this.items = [{
                    "id": 1,
                    "code": "TIP",
                    "label": "TIP",
                    "active": false
                },
                {
                    "id": 2,
                    "code": "VIR",
                    "label": "Credit Transfer",
                    "active": true
                },
                {
                    "id": 3,
                    "code": "PRE",
                    "label": "Direct Debit",
                    "active": true
                },
                {
                    "id": 4,
                    "code": "LIQ",
                    "label": "Cash",
                    "active": true
                },
                {
                    "id": 6,
                    "code": "CB",
                    "label": "Credit Card",
                    "active": true
                }
            ]
        },
        fetchGenreById(id) {
            return this.items.find(item => item.rowid == id)
        }

    },
})