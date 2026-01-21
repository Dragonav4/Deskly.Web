import { getApiDesks, getApiDesksById, postApiDesks, putApiDesksById, deleteApiDesksById } from '../../../shared/api/generated'
import type { DeskView, DeskCreateView } from '../../../shared/api/generated'

export const desksApi = {
    async getAll(params: { page?: number; size?: number } = {}) {
        const { page = 0, size = 10 } = params
        const skip = page * size
        const take = size
        const r = await getApiDesks({ query: { skip, take } })
        return r.data
    },

    async get(id: string) {
        return getApiDesksById({ path: { id } }).then(r => r.data)
    },

    async create(payload: DeskCreateView) {
        const r = await postApiDesks({ body: payload })
        return r.data
    },

    async update(id: string, payload: DeskView) {
        return putApiDesksById({ path: { id }, body: payload }).then(r => r.data)
    },

    async delete(id: string) {
        return deleteApiDesksById({ path: { id } }).then(r => r.data)
    },
}
