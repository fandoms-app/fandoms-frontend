import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";
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
    const res = await axios.post("http://localhost:3000/auth/login", {
      email,
      password,
    });
    const { accessToken, refreshToken } = res.data;
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const register = async (
    nombreUsuario: string,
    email: string,
    password: string,
    fechaNacimiento: string
  ) => {
    const res = await axios.post("http://localhost:3000/auth/register", {
      nombreUsuario,
      email,
      password,
      fechaNacimiento,
    });
    const { accessToken, refreshToken } = res.data;
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  useEffect(() => {
    if (accessToken) {
      axios
        .get<Usuario>("http://localhost:3000/usuario/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          logout(); // si el token no sirve, se limpia
        });
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
