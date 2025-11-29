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
