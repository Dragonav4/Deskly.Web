import { http } from '../../../shared/api'
import type {
    Desk,
    DeskCreateDto,
    DeskUpdateDto,
    DeskListResponse,
} from '../types/types'

export const desksApi = {
    async getAll(params: { page?: number; size?: number } = {}): Promise<DeskListResponse> {
        const { page = 0, size = 10 } = params
        const skip = page * size
        const take = size
        const r = await http.get('/desks', { params: { skip, take } })
        return r.data
    },

    async get(id: string): Promise<Desk> {
        return http.get(`/desks/${id}`).then(r => r.data)
    },

    async create(payload: DeskCreateDto) {
        const r = await http.post('/desks', payload)
        return r.data as DeskUpdateDto
    },

    async update(id: string, payload: DeskUpdateDto) {
        return http.put(`/desks/${id}`, payload).then(r => r.data as DeskUpdateDto)
    },

    async delete(id: string) {
        return http.delete(`/desks/${id}`).then(r => r.data)
    },
}
