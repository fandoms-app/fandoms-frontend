import type { Publicacion } from "../types/publicacion";
import api from "./api";

export const createPublicacion = (data: FormData) => {
  return api.post("/publicaciones", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getPublicacionesByCanal = (idCanal: string) =>
    api.get<Publicacion[]>(`/publicaciones/canal/${idCanal}`);

export const getPublicacionById = (id: string) =>
    api.get<Publicacion & { comentarios: Publicacion[] }>(`/publicaciones/${id}`);

export const replyToPublicacion = (id: string, formData: FormData) =>
    api.post<Publicacion>(`/publicaciones/${id}/responder`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const updatePublicacion = (id: string, data: Partial<Publicacion>) =>
    api.patch<Publicacion>(`/publicaciones/${id}`, data);

export const deletePublicacion = (id: string) =>
    api.delete(`/publicaciones/${id}`);
