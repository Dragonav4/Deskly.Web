import { http } from '../../../shared/api'
import type {
    ReservationListResponse,
    Reservation,
    ReservationCreateDto,
    ReservationUpdateDto,
} from '../types/types'
export const reservationsApi = {
    async getAll(params: { page?: number; size?: number } = {}): Promise<ReservationListResponse> {
        const { page = 0, size = 10 } = params
        const skip = page * size
        const take = size
        const r = await http.get('/reservations', { params: { skip, take } })
        return r.data
    },
    

    async get(id: string): Promise<Reservation> {
        return http.get(`/reservations/${id}`).then(r => r.data)
    },

    async create(payload: ReservationCreateDto) {
        const r = await http.post('/reservations', payload)
        return r.data as Reservation
    },

    async update(id: string, payload: ReservationUpdateDto) {
        console.log("update request send with:", id)
        return http.put(`/reservations/${id}`, payload).then(r => r.data as Reservation)
    },

    async delete(id: string) {
        return http.delete(`/reservations/${id}`).then(r => r.data)
    },
}