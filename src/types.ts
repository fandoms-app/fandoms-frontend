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
