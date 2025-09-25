import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import api from "../api/api";
import type { Usuario } from "../types";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: Usuario | null;
  loadingUser: boolean;
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
  const [loadingUser, setLoadingUser] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );

  const fetchUser = useCallback(async () => {
    if (!accessToken) {
      setUser(null);
      setLoadingUser(false);
      return;
    }
    try {
      const res = await api.get<Usuario>("/usuario/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { accessToken, refreshToken } = res.data;

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    await fetchUser();
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
    const { accessToken, refreshToken } = res.data;

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    await fetchUser();
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
      value={{
        accessToken,
        refreshToken,
        user,
        loadingUser,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
