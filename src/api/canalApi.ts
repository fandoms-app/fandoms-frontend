import api from "./api";
import type { Canal, Usuario } from "../types";

export const getAllCanales = () =>
    api.get<Canal[]>("/canales");

export const getRootCanales = () =>
    api.get<Canal[]>("/canales/root");

export const getCanal = (id: string) =>
    api.get<Canal>(`/canales/${id}`);

export const createCanal = (data: { nombreCanal: string; descripcion?: string; idCanalPadre?: string | null }) =>
    api.post<Canal>("/canales", data);

export const updateCanal = (id: string, data: Partial<Canal>) =>
    api.patch<Canal>(`/canales/${id}`, data);

export const deleteCanal = (id: string) =>
    api.delete(`/canales/${id}`);

export const followCanal = (id: string) =>
    api.post<{ ok: true }>(`/canales/${id}/follow`);

export const unfollowCanal = (id: string) =>
    api.delete<{ ok: true }>(`/canales/${id}/follow`);

export const getCanalFollowers = (id: string) =>
    api.get<Usuario[]>(`/canales/${id}/seguidores`);

export const getMyFollowedCanales = () =>
    api.get<Canal[]>("/canales/me/seguidos");

export const getSubCanales = (id: string) =>
    api.get<Canal[]>(`/canales/${id}/subcanales`);
