import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({ //*an interface for interacting with your application's data cache.
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            staleTime: 30_000, //*when data is considered ‘old’ but still resides in the cache(and RAM).
            gcTime: 5 * 60_000, //*No component on the screen uses the request anymore (it becomes inactive) and the countdown begins
        },
        mutations: {
            retry: 0,
        },
    },
})
