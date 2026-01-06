import { queryOptions } from '@tanstack/react-query'
import { queryClient } from '../../../app/queryClient'

export interface CrudApi<T, CreateDto, UpdateDto> {
    getAll(params?: { page: number; size: number }): Promise<{ items: T[]; actions: number; totalCount: number }>
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
        getAll: (params?: { page: number; size: number }) =>
            queryOptions({ //* just typesafe wrapping(blueprint) for useSuspenceQuery(), 
                queryKey: params ? [name, 'list', params] : [name, 'list'], //*key for invalidation purposes,
                queryFn: () => api.getAll(params),
            }),

        getById: (id: string) =>
            queryOptions({
                queryKey: [name, id],
                queryFn: () => api.get(id),
            }),
        create: {
            mutationFn: (data: CreateDto) => api.create(data),
            onSuccess: (_data: T, _variables: CreateDto, _context: unknown) => {
                queryClient.invalidateQueries({ queryKey: [name, 'list'] })
            },
        },

        update: {
            mutationFn: ({ id, data }: { id: string; data: UpdateDto }) => //*Mutation func responsible for real api requests 
                api.update(id, data),
            onSuccess: (_data: T, variables: { id: string; data: UpdateDto }, _context: unknown) => { //*if api request -> successful -> onSuccess
                queryClient.invalidateQueries({ queryKey: [name, 'list'] })
                queryClient.invalidateQueries({ queryKey: [name, variables.id] })
            },
        },

        delete: {
            mutationFn: (id: string) => api.delete(id),
            onSuccess: (_data: void, _variables: string, _context: unknown) => { //* _ -> "I know this argument is there, but I'm not going to use it in the body of the function"
                queryClient.invalidateQueries({ queryKey: [name, 'list'] })
            },
        },
    }
}
