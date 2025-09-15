import { createContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import api from "../api/api";
import type { Usuario } from "../types";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: Usuario | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    nombreUsuario: string,
    email: string,
    password: string,
    fechaNacimiento: string
  ) => Promise<void>;
  logout: () => void;
  setUser: (user: Usuario | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { accessToken, refreshToken, user } = res.data;

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const register = async (
    nombreUsuario: string,
    email: string,
    password: string,
    fechaNacimiento: string
  ) => {
    const res = await api.post("/auth/register", {
      nombreUsuario,
      email,
      password,
      fechaNacimiento,
    });
    const { accessToken, refreshToken, user } = res.data;

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, user, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
