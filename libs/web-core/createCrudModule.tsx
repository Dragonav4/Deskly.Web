import * as React from 'react'
import { createRoute, type AnyRoute } from '@tanstack/react-router'
import { createCrudQueries, type CrudApi } from './createCrudQueries'
import type { QueryClient } from '@tanstack/react-query'

type CrudViews = {
    List: React.ComponentType
    View: React.ComponentType
    Create: React.ComponentType
    Edit: React.ComponentType
}

type CreateCrudModuleParams<T, CreateDto, UpdateDto> = {
    name: string
    api: CrudApi<T, CreateDto, UpdateDto>
    views: CrudViews
    queryClient: QueryClient
    parentRoutes: {
        public: AnyRoute
        protected: AnyRoute
    }
}

export function createCrudModule<T, CreateDto, UpdateDto>({
    name,
    api,
    views,
    queryClient,
    parentRoutes,
}: CreateCrudModuleParams<T, CreateDto, UpdateDto>) {
    const queries = createCrudQueries<T, CreateDto, UpdateDto>(name, api, queryClient)

    const publicBase = createRoute({
        getParentRoute: () => parentRoutes.public,
        path: name,
    })

    const listRoute = createRoute({
        getParentRoute: () => publicBase,
        path: '/',
        validateSearch: (search: Record<string, unknown>) => ({
            page: Number(search.page ?? 0),
            size: Number(search.size ?? 10),
        }),
        loader: ({ context, search }: any) =>
            context.queryClient.ensureQueryData(queries.getAll(search)),
        component: () => <views.List />,
    })

    const viewRoute = createRoute({
        getParentRoute: () => publicBase,
        path: '$id',
        loader: ({ context, params }: any) =>
            context.queryClient.ensureQueryData(
                queries.getById(params.id),
            ),
        component: () => <views.View />,
    })

    const protectedBase = createRoute({
        getParentRoute: () => parentRoutes.protected,
        path: name,
    })

    const createRoute_ = createRoute({
        getParentRoute: () => protectedBase,
        path: 'create',
        component: () => <views.Create />,
    })

    const editRoute = createRoute({
        getParentRoute: () => protectedBase,
        path: '$id/edit',
        component: () => <views.Edit />,
    })

    return {
        id: name,
        routes: {
            list: listRoute,
            view: viewRoute,
            create: createRoute_,
            edit: editRoute,
        },
        routesTree: {
            public: publicBase,
            protected: protectedBase,
        },
        queries,
    }
}
