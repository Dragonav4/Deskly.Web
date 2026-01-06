import { Outlet, createRoute } from '@tanstack/react-router'
import { rootRoute } from './rootRoute'

export const publicRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'public',
    path: '',
    component: PublicLayout,
})

function PublicLayout() { //*Outlet place where router ‘inserts’ the content of the current page (e.g., a list of tables or an editing form).
    return (
        <>
            <Outlet />
        </>
    )
}
