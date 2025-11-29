export type EstadoSolicitud = "pendiente" | "aprobada" | "rechazada";

export interface SolicitudCanal {
  id: string;
  idUsuario: string;
  idCanalPadre: string | null;

  nombre: string;
  descripcion: string | null;
  estado: EstadoSolicitud;
  fechaSolicitud: string;

  usuario: {
    id: string;
    nombreUsuario: string;
  };

  canalPadre?: {
    id: string;
    nombreCanal: string;
  } | null;
}
