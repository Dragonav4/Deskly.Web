export interface AuthInterceptorOptions {
    onUnauthorized: () => void;
    onForbidden?: () => void;
    loginUrl: string;
    shouldRedirect: (pathname: string) => boolean;
}

export function setupAuthInterceptor(client: any, options: AuthInterceptorOptions) {

    const axiosInstance = client.instance || client.axios;

    if (!axiosInstance) {
        console.error('Axios instance not found on client. Interceptors not applied.');
        return;
    }

    axiosInstance.interceptors.response.use(
        (response: any) => response,
        (error: any) => {
            const status = error.response?.status;

            if (status === 401) {
                options.onUnauthorized();
                if (options.shouldRedirect(window.location.pathname)) {
                    const returnUrl = window.location.origin;
                    window.location.href = `${options.loginUrl}?returnUrl=${encodeURIComponent(returnUrl)}`;
                }
            }

            if (status === 403) {
                options.onForbidden?.();
                if (options.shouldRedirect(window.location.pathname)) {
                    const returnUrl = window.location.origin;
                    window.location.href = `${options.loginUrl}?returnUrl=${encodeURIComponent(returnUrl)}`;
                }
            }

            return Promise.reject(error);
        }
    );
}

export function setupErrorInterceptor(client: any) {
    const axiosInstance = client.instance || client.axios;

    if (!axiosInstance) return;

    axiosInstance.interceptors.response.use(
        (response: any) => response,
        (error: any) => {
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
}
