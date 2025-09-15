import axios from "axios";
import type { Usuario } from "../types";

const BASE_URL = "http://localhost:3000";

const api = axios.create({
    baseURL: BASE_URL,
});

// acceso a setuser de AuthContext
let setUserFn: ((u: Usuario | null) => void) | null = null;
export const setAuthContextUserSetter = (fn: (u: Usuario | null) => void) => {
    setUserFn = fn;
};

// interceptor de requests
api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// interceptor de responses (refresh automatico)
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else if (token) prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem("refreshToken");

        if (!originalRequest) return Promise.reject(error);

        const isRefreshEndpoint = originalRequest.url?.includes("/auth/refresh");

        if (
            error.response?.status === 401 &&
            refreshToken &&
            !originalRequest._retry &&
            !isRefreshEndpoint
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers = originalRequest.headers ?? {};
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });

                const newAccessToken = res.data.accessToken;
                const newRefreshToken = res.data.refreshToken;

                localStorage.setItem("accessToken", newAccessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                originalRequest._retry = false;

                if (setUserFn) {
                    try {
                        const me = await api.get<Usuario>("/usuario/me");
                        setUserFn(me.data);
                    } catch {
                        setUserFn(null);
                    }
                }

                processQueue(null, newAccessToken);
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                if (setUserFn) setUserFn(null);
                window.location.href = "/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
