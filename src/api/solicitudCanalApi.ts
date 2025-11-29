import api from "./api";
import type { SolicitudCanal } from "../types/solicitudCanal";

export const crearSolicitudCanal = (data: {
  nombre: string;
  descripcion?: string | null;
  idCanalPadre?: string | null;
}) =>
  api.post("/solicitudes-canal", data).then((res) => res.data);

export const obtenerSolicitudesCanal = (): Promise<SolicitudCanal[]> =>
  api.get("/solicitudes-canal").then((res) => res.data);

export const obtenerMisSolicitudes = (): Promise<SolicitudCanal[]> =>
  api.get("/solicitudes-canal/mis-solicitudes").then((res) => res.data);

export const aprobarSolicitudCanal = (id: string) =>
  api.patch(`/solicitudes-canal/${id}/aprobar`).then((res) => res.data);

export const rechazarSolicitudCanal = (id: string) =>
  api.patch(`/solicitudes-canal/${id}/rechazar`).then((res) => res.data);
