import { QueryClient, queryOptions } from '@tanstack/react-query'

export interface CrudApi<T, CreateDto, UpdateDto> {
    getAll(params?: { page: number; size?: number }): Promise<{ items: T[]; actions: number; totalCount: number }>
    get(id: string): Promise<T | undefined>
    create(data: CreateDto): Promise<T | undefined>
    update(id: string, data: UpdateDto): Promise<T | undefined>
    delete(id: string): Promise<any>
}

export function createCrudQueries<T, CreateDto, UpdateDto>(
    name: string,
    api: CrudApi<T, CreateDto, UpdateDto>,
    queryClient: QueryClient, // Теперь мы ПРИНИМАЕМ клиент, а не импортируем его
) {
    return {
        getAll: (params?: { page: number; size: number }) =>
            queryOptions({
                queryKey: params ? [name, 'list', params] : [name, 'list'],
                queryFn: () => api.getAll(params),
            }),

        getById: (id: string) =>
            queryOptions({
                queryKey: [name, id],
                queryFn: () => api.get(id),
            }),

        create: {
            mutationFn: (data: CreateDto) => api.create(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [name, 'list'] })
            },
        },

        update: {
            mutationFn: ({ id, data }: { id: string; data: UpdateDto }) =>
                api.update(id, data),
            onSuccess: (_data: T, variables: { id: string; data: UpdateDto }) => {
                queryClient.invalidateQueries({ queryKey: [name, 'list'] })
                queryClient.invalidateQueries({ queryKey: [name, variables.id] })
            },
        },

        delete: {
            mutationFn: (id: string) => api.delete(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [name, 'list'] })
            },
        },
    }
}
