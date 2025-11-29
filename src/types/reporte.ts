export type EstadoReporte = "pendiente" | "resuelto" | "rechazado";
export type TipoReporte = "usuario" | "publicacion" | "canal";

export interface Reporte {
  id: string;
  motivo: string;
  tipo: TipoReporte;
  idObjetivo: string;
  estado: EstadoReporte;
  fechaCreacion: string;
  usuarioReporta: {
    id: string;
    nombreUsuario: string;
  };
}
