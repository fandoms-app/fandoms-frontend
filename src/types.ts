export interface Usuario {
  id: string;
  nombreUsuario: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  fechaNacimiento: string;
  fechaCreacion: string;
  rol: string;
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
