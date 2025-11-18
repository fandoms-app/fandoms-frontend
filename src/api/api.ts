import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { auth } from "../firebase/firebase";

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();

        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.warn("No se pudo obtener el token de Firebase", error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
