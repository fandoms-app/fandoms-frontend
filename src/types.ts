export interface Usuario {
  id: string;
  nombreUsuario: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  fechaNacimiento: string; // backend lo devuelve como date, llega como string en json
  fechaCreacion: string;
  rol: string; // viene del enum rolglobal
}
