import {
    defineStore
} from 'pinia'

export const useGenreStore = defineStore('gender', {
    state: () => ({
        items: [],
        loading: false,
        error: '',
    }),

    actions: {
        fetchGenre(options = {}) {
            this.loading = true
            this.error = ''

            this.items = [{
                    id: '1',
                    label: 'Homme',
                    active: 1
                },
                {
                    id: '2',
                    label: 'Femme',
                    active: 1
                }
            ]
        },
        fetchGenreById(id) {
            return this.items.find(item => item.rowid == id)
        }

    },
})