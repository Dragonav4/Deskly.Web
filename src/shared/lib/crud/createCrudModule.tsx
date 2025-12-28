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

    /* ---------- PUBLIC ---------- */

    const publicBase = createRoute({
        getParentRoute: () => publicRoute,
        path: name,
    })

    const listRoute = createRoute({
        getParentRoute: () => publicBase,
        path: '/',
        loader: ({ context }) =>
            context.queryClient.ensureQueryData(queries.getAll()),
        component: () => <views.List />,
    })

    /* ---------- PROTECTED ---------- */

    const protectedBase = createRoute({
        getParentRoute: () => protectedRoute,
        path: name,
    })

    const viewRoute = createRoute({
        getParentRoute: () => protectedBase,
        path: '$id',
        loader: ({ context, params }) =>
            context.queryClient.ensureQueryData(
                queries.getById(params.id),
            ),
        component: () => <views.View />,
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
            public: publicBase.addChildren([listRoute]),
            protected: protectedBase.addChildren([
                viewRoute,
                createRoute_,
                editRoute,
            ]),
        },
        queries,
    }
}
