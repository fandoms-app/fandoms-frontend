import { createContext } from "react";
import type { Usuario } from "../types/usuario";

export interface AuthContextValue {
  user: Usuario | null;
  loadingUser: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (payload: {
    nombreUsuario: string;
    email: string;
    password: string;
    fechaNacimiento?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
