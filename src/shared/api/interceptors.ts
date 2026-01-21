import { client } from './generated/client.gen'
import { auth } from '../../features/auth/store/authStore'
import { API_URL } from './http'

client.instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            auth.signOut();

            const isListPage = ['/', '/desks', '/reservations', '/reservations/'].includes(window.location.pathname);
            const isReservationView = /^\/reservations\/[^/]+$/.test(window.location.pathname);
            const isPublicOrView = isListPage || isReservationView;

            if (!isPublicOrView) {
                const returnUrl = window.location.origin;
                window.location.href = `${API_URL}/Auth/login?returnUrl=${encodeURIComponent(returnUrl)}`;
            }
        }
        return Promise.reject(error);
    }
);

client.instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.data) {
            const data = error.response.data;
            const serverMessage = data.detail || data.title || data.message;

            if (serverMessage) {
                error.message = serverMessage;
            }
        }
        return Promise.reject(error);
    }
);