import { queryOptions } from '@tanstack/react-query'

export interface CrudApi<T, CreateDto, UpdateDto> {
    getAll(): Promise<{ items: T[]; actions: number }>
    get(id: string): Promise<T>
    create(data: CreateDto): Promise<T & { id: string }>
    update(id: string, data: UpdateDto): Promise<T>
    delete(id: string): Promise<void>
}

export function createCrudQueries<T, CreateDto, UpdateDto>(
    name: string,
    api: CrudApi<T, CreateDto, UpdateDto>,
) {
    return {
        getAll: () =>
            queryOptions({
                queryKey: [name, 'list'],
                queryFn: api.getAll,
            }),

        getById: (id: string) =>
            queryOptions({
                queryKey: [name, id],
                queryFn: () => api.get(id),
            }),
        create: {
            mutationFn: (data: CreateDto) => api.create(data),
        },

        update: {
            mutationFn: ({ id, data }: { id: string; data: UpdateDto }) =>
                api.update(id, data),
        },

        delete: {
            mutationFn: (id: string) => api.delete(id),
        },
    }
}
