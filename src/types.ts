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
}
