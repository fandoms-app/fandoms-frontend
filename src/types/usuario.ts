export interface Usuario {
  id: string;
  email: string;
  nombreUsuario?: string | null;
  avatar?: string | null;
  fechaNacimiento?: string | null;
  bio?: string | null;
  rol?: string | null;
}
