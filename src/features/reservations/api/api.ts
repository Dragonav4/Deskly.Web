import { getApiReservations, getApiReservationsById, postApiReservations, putApiReservationsById, deleteApiReservationsById } from '../../../shared/api/generated'
import type { ReservationView, ReservationCreateView } from '../../../shared/api/generated'

export const reservationsApi = {
    async getAll(params: { page?: number; size?: number } = {}) {
        const { page = 0, size = 10 } = params
        const skip = page * size
        const take = size
        const r = await getApiReservations({ query: { skip, take } })
        return r.data
    },

    async get(id: string) {
        return getApiReservationsById({ path: { id } }).then(r => r.data)
    },

    async create(payload: ReservationCreateView) {
        const r = await postApiReservations({ body: payload })
        return r.data
    },

    async update(id: string, payload: ReservationView) {
        return putApiReservationsById({ path: { id }, body: payload }).then(r => r.data)
    },

    async delete(id: string) {
        return deleteApiReservationsById({ path: { id } }).then(r => r.data)
    },
}