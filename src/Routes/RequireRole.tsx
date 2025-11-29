import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import type { JSX } from "react";

interface Props {
  allowed: Array<"usuario" | "moderador" | "admin">;
  children: JSX.Element;
}

export default function RequireRole({ allowed, children }: Props) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const rol = (user.rol ?? "usuario").toLowerCase() as
    | "usuario"
    | "moderador"
    | "admin";

  if (!allowed.includes(rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
