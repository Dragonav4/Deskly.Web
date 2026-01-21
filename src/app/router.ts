import { createRouter } from '@tanstack/react-router'
import { queryClient } from './queryClient'
import { auth } from '../features/auth/store/authStore'

// Root + groups
import { rootRoute } from '../routes/rootRoute'
import { publicRoute } from '../routes/public'
import { protectedRoute } from '../routes/protected'
import { indexRoute } from '../routes'
import { authModule } from "../features/auth";


// Modules
import { modules } from "../features";

const publicModuleRoutes = modules.map(m => 
    m.routesTree.public.addChildren([m.routes.list, m.routes.view])
)

const protectedModuleRoutes = modules.map(m =>
    m.routesTree.protected.addChildren([
        m.routes.create,
        m.routes.edit,
    ])
)


const routeTree = rootRoute.addChildren([
    indexRoute,
    publicRoute.addChildren([...publicModuleRoutes, authModule.routes.login]),
    protectedRoute.addChildren([...protectedModuleRoutes]),
])

export const router = createRouter({
    routeTree,
    context: {
        queryClient,
        auth,
    },
})
