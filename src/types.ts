export interface Usuario {
  id: string;
  email: string;
  nombreUsuario?: string | null;
  avatar?: string | null;
  fechaNacimiento?: string | null;
  bio?: string | null;
  rol?: string | null;
}

export interface Canal {
  id: string;
  nombreCanal: string;
  descripcion: string | null;
  fechaCreacion: string;
  idCanalPadre: string | null;
  followersCount?: number;
}
export interface Publicacion {
  id: string;
  titulo?: string | null;
  contenido: string;
  mediaUrl?: string | null;
  fechaCreacion: string;
  idUsuario: string;
  idCanal: string;
  idPublicacionPadre?: string | null;
  nombreUsuario?: string;
  avatarUsuario?: string | null;
  comentarios?: Publicacion[];
  comentariosCount?: number;
  eliminada?: boolean;
}

export type EstadoReporte = "pendiente" | "resuelto" | "rechazado";
export type TipoReporte = "usuario" | "publicacion" | "canal";

export interface Reporte {
  id: string;
  motivo: string;
  tipo: TipoReporte;
  idObjetivo: string;
  estado: EstadoReporte;
  fechaCreacion: string;
  usuarioReporta: {
    id: string;
    nombreUsuario: string;
  };
}

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
