import { Outlet, createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from './rootRoute'
import { auth } from '../features/auth/store/authStore'


export const protectedRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'protected',
    path: '', // pathless layout

    beforeLoad: ({ location }) => {
        if (!auth.isAuthenticated()) {
            throw redirect({
                to: '/auth/login',
                search: {
                    redirect: location.href, //returns you back after auth
                },
            })
        }
    },

    component: ProtectedLayout,
})

function ProtectedLayout() {
    return (
        <>
            <Outlet />
        </>
    )
}
