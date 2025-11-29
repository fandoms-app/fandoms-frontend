export interface Canal {
  id: string;
  nombreCanal: string;
  descripcion: string | null;
  fechaCreacion: string;
  idCanalPadre: string | null;
  followersCount?: number;
}
