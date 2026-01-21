import { getApiUsers, getApiUsersById, postApiUsers, putApiUsersById, deleteApiUsersById } from '../../../shared/api/generated'
import type { UserView, UserCreateView } from '../../../shared/api/generated'

export const usersApi = {
    async getAll(params: { page?: number; size?: number } = {}) {
        const { page = 0, size = 10 } = params
        const skip = page * size
        const take = size
        const r = await getApiUsers({ query: { skip, take } })
        return r.data
    },

    async get(id: string) {
        return getApiUsersById({ path: { id } }).then(r => r.data)
    },

    async create(payload: UserCreateView) {
        const r = await postApiUsers({ body: payload })
        return r.data
    },

    async update(id: string, payload: UserView) {
        return putApiUsersById({ path: { id }, body: payload }).then(r => r.data)
    },

    async delete(id: string) {
        return deleteApiUsersById({ path: { id } }).then(r => r.data)
    },
}
