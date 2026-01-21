import * as React from 'react'
import { createRoute } from '@tanstack/react-router'
import { publicRoute } from '../../../routes/public'
import { protectedRoute } from '../../../routes/protected'
import { createCrudQueries, type CrudApi } from './createCrudQueries'

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
}

export function createCrudModule<T, CreateDto, UpdateDto>({
    name,
    api,
    views,
}: CreateCrudModuleParams<T, CreateDto, UpdateDto>) {
    const queries = createCrudQueries<T, CreateDto, UpdateDto>(name, api)
    

    const publicBase = createRoute({
        getParentRoute: () => publicRoute,
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
            context.queryClient.ensureQueryData(queries.getAll(search)), //if in cache -> show, if not .getall
        component: () => <views.List />,
    })

    const viewRoute = createRoute({
        getParentRoute: () => publicBase,
        path: '$id',
        loader: ({ context, params }) =>
            context.queryClient.ensureQueryData(
                queries.getById(params.id),
            ),
        component: () => <views.View />,
    })


    const protectedBase = createRoute({
        getParentRoute: () => protectedRoute,
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

    const routesTree = {
        public: publicBase,
        protected: protectedBase,
    }

    return {
        id: name, //reservation.routes.create // change in one place 
        routes: {
            list: listRoute,
            view: viewRoute,
            create: createRoute_,
            edit: editRoute,
        },
        routesTree,
        queries,
    }
}
