import api from "./api";
import type { Usuario } from "../types";

export const getMe = () => api.get<Usuario>("/usuario/me");

export const updateMe = (data: Partial<Usuario>) =>
  api.patch<Usuario>("/usuario/me", data);

export const getUserProfile = (id: string) =>
  api.get<Usuario & {
    publicacionesCount: number;
    seguidoresCount: number;
    seguidosCount: number;
  }>(`/usuario/${id}/profile`);

export const followUser = (id: string) =>
  api.post<{ ok: boolean }>(`/usuario/${id}/follow`);

export const unfollowUser = (id: string) =>
  api.delete<{ ok: boolean }>(`/usuario/${id}/follow`);

export const getFollowers = (id: string) =>
  api.get<Usuario[]>(`/usuario/${id}/seguidores`);

export const getFollowing = (id: string) =>
  api.get<Usuario[]>(`/usuario/${id}/seguidos`);
