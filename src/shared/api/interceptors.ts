// src/shared/api/interceptors.ts
import { http } from './http'
import { auth } from '../../features/auth'

http.interceptors.request.use(config => {
    const token = auth.getAccessToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// http.interceptors.response.use(... refresh / 401 ...)
