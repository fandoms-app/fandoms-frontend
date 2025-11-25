import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Reporte, SolicitudCanal, Canal, Usuario } from "../types";
import { obtenerReportes } from "../api/reporteApi";
import { obtenerSolicitudesCanal } from "../api/solicitudCanalApi";
import { getAllCanales } from "../api/canalApi";
import { getAllUsuarios } from "../api/usuarioApi";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import ListPreview from "../components/ListPreview";
import QuickButton from "../components/QuickButton";

export default function StaffDashboard() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudCanal[]>([]);
  const [canales, setCanales] = useState<Canal[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await obtenerReportes();
        const s = await obtenerSolicitudesCanal();
        const cRes = await getAllCanales();
        const uRes = await getAllUsuarios();

        setReportes(r);
        setSolicitudes(s);
        setCanales(cRes.data);
        setUsuarios(uRes.data);
      } catch (err) {
        console.error("Error cargando dashboard staff:", err);
      }
    };

    void load();
  }, []);

  const reportesPendientes = reportes.filter(r => r.estado === "pendiente");
  const solicitudesPendientes = solicitudes.filter(s => s.estado === "pendiente");

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-purple-700">Panel de Moderación</h1>

      <section>
        <h2 className="text-xl font-semibold mb-3">Estadísticas generales</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Reportes pendientes" value={reportesPendientes.length} />
          <StatCard label="Solicitudes pendientes" value={solicitudesPendientes.length} />
          <StatCard label="Total de canales" value={canales.length} />
          <StatCard label="Total de usuarios" value={usuarios.length} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Acciones rápidas</h2>

        <div className="flex flex-wrap gap-4">
          <QuickButton to="/create-channel" label="Crear canal" />
          <QuickButton to="/reportes" label="Gestionar reportes" />
          <QuickButton to="/gestionar-solicitudes" label="Gestionar solicitudes" />
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Últimas solicitudes de canal</h2>
          <Link to="/gestionar-solicitudes" className="text-purple-600 hover:underline">
            Ver todas
          </Link>
        </div>

        <ListPreview<SolicitudCanal>
          items={solicitudes.slice(0, 3)}
          emptyMessage="No hay solicitudes."
          render={(s) => (
            <Card key={s.id} className="p-3 shadow border text-sm space-y-1">
              <p className="font-semibold text-purple-700">
                {s.nombre}
              </p>

              {s.descripcion && (
                <p className="text-gray-600">
                  {s.descripcion}
                </p>
              )}

              <p className="text-gray-700">
                {s.idCanalPadre
                  ? `Subcanal de ${s.canalPadre?.nombreCanal ?? "Desconocido"}`
                  : "Canal"}
              </p>
            </Card>
          )}
        />

      </section>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Últimos reportes</h2>
          <Link to="/reportes" className="text-purple-600 hover:underline">
            Ver todos
          </Link>
        </div>

        <ListPreview<Reporte>
          items={reportes.slice(0, 3)}
          emptyMessage="No hay reportes."
          render={(r) => (
            <Card
              key={r.id}
              className="p-3 shadow border text-sm space-y-1 flex flex-col justify-between"
            >
              <p className="font-semibold text-purple-700">
                {r.motivo}
              </p>

              <p className="text-gray-700 capitalize">
                {r.tipo === "usuario"
                  ? "Usuario"
                  : r.tipo === "publicacion"
                    ? "Publicación"
                    : "Canal"}
              </p>
            </Card>
          )}
        />
      </section>
    </div>
  );
}
