import api from "./api";
import type { Usuario } from "../types";

export const getMe = () => api.get<Usuario>("/usuarios/me");

export const getUsuarioById = (id: string) =>
  api.get<Usuario>(`/usuarios/${id}`);

export const getAllUsuarios = () =>
  api.get<Usuario[]>("/usuarios");

export const updateMe = (data: Partial<Usuario>) =>
  api.patch<Usuario>("/usuarios/me", data);

export const getUserProfile = (id: string) =>
  api.get<Usuario & {
    publicacionesCount: number;
    seguidoresCount: number;
    seguidosCount: number;
  }>(`/usuarios/${id}/profile`);

export const followUser = (id: string) =>
  api.post<{ ok: boolean }>(`/usuarios/${id}/follow`);

export const unfollowUser = (id: string) =>
  api.delete<{ ok: boolean }>(`/usuarios/${id}/follow`);

export const getFollowers = (id: string) =>
  api.get<Usuario[]>(`/usuarios/${id}/seguidores`);

export const getFollowing = (id: string) =>
  api.get<Usuario[]>(`/usuarios/${id}/seguidos`);

export const uploadAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.patch<Usuario>("/usuarios/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteUser = (id: string) =>
  api.delete<{ ok: boolean }>(`/usuarios/${id}`);

export const cambiarRolUsuario = (id: string, rol: string) =>
  api.patch(`/usuarios/${id}/rol`, { rol }).then(res => res.data);
