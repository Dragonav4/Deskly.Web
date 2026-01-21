import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import './i18n'
import './shared/api/interceptors'
import { client } from './shared/api'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5126/api'
const origin = apiBase.replace(/\/api$/, '')

client.setConfig({
    baseURL: origin,
    withCredentials: true,
})


import { ThemeContextProvider } from './app/ThemeContext'
import { queryClient } from "./app/queryClient";
import { router } from "./app/router";

//ReactDom Virtual DOM which translates into HTML tags
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeContextProvider>
                <RouterProvider router={router} />
            </ThemeContextProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)