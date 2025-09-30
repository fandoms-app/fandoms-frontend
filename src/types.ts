export interface Usuario {
  id: string;
  nombreUsuario: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  fechaNacimiento: string;
  fechaCreacion: string;
  rol: string; // viene del enum rolglobal
}

export interface Canal {
  id: string;
  nombreCanal: string;
  descripcion?: string | null;
  fechaCreacion: string;
  idCanalPadre?: string | null;
  followersCount?: number;
}
