import type { Reporte } from "../types/reporte";
import api from "./api";

export const crearReporte = (payload: {
  motivo: string;
  tipo: "usuario" | "publicacion" | "canal";
  idObjetivo: string;
}) => api.post("/reportes", payload);

export const obtenerReportes = () =>
  api.get<Reporte[]>("/reportes").then((r) => r.data);

export const obtenerReporte = (id: string) =>
  api.get<Reporte>(`/reportes/${id}`).then((r) => r.data);

export const resolverReporte = (id: string) =>
  api.patch(`/reportes/${id}/resolver`);

export const rechazarReporte = (id: string) =>
  api.patch(`/reportes/${id}/rechazar`);

export const eliminarReporte = (id: string) =>
  api.delete(`/reportes/${id}`);
