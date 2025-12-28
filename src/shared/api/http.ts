// src/shared/api/http.ts
import axios from 'axios'

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5126/api',
    withCredentials: true,
})