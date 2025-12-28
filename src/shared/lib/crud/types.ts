export type ListResponse<T> = {
    items: T[]
    actions: number // 1-canCreate, 2-canModify, 4-canDelete
}