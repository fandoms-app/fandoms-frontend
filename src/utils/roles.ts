export type Rol = "usuario" | "moderador" | "admin";

export const getRol = (rol?: string | null): Rol => {
  const r = (rol ?? "usuario").toLowerCase();
  if (r === "admin" || r === "moderador") return r;
  return "usuario";
};

export const esAdmin = (rol?: string | null): boolean =>
  getRol(rol) === "admin";

export const esModerador = (rol?: string | null): boolean =>
  getRol(rol) === "moderador";

export const esStaff = (rol?: string | null): boolean =>
  esAdmin(rol) || esModerador(rol);
