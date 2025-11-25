import { useEffect, useState } from "react";
import {
  obtenerReportes,
  resolverReporte,
  rechazarReporte,
  eliminarReporte
} from "../api/reporteApi";
import { getUsuarioById } from "../api/usuarioApi";
import { getCanal } from "../api/canalApi";
import type { Reporte } from "../types";

import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import Card from "../components/Card";
import { Link } from "react-router-dom";

interface Objetivo {
  nombre: string;
  link: string;
}

export default function ReportesPage() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [objetivos, setObjetivos] = useState<Record<string, Objetivo>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await obtenerReportes();
      setReportes(data);

      const mapa: Record<string, Objetivo> = {};

      for (const r of data) {
        if (r.tipo === "usuario") {
          const u = await getUsuarioById(r.idObjetivo);
          mapa[r.id] = {
            nombre: u.data.nombreUsuario ?? "Usuario desconocido",
            link: `/usuarios/${u.data.id}`
          };
        }

        if (r.tipo === "canal") {
          const c = await getCanal(r.idObjetivo);
          mapa[r.id] = {
            nombre: c.data.nombreCanal ?? "Canal desconocido",
            link: `/canales/${c.data.id}`
          };
        }

        if (r.tipo === "publicacion") {
          mapa[r.id] = {
            nombre: "Ver publicación",
            link: `/publicaciones/${r.idObjetivo}`
          };
        }
      }

      setObjetivos(mapa);
    } catch (err) {
      console.error("Error cargando reportes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const getBadge = (estado: string) => {
    const base =
      "px-3 py-1 rounded-full text-xs font-semibold shadow-sm border";

    switch (estado) {
      case "pendiente":
        return `${base} bg-yellow-100 text-yellow-800 border-yellow-300`;
      case "resuelto":
        return `${base} bg-green-100 text-green-800 border-green-300`;
      case "rechazado":
        return `${base} bg-red-100 text-red-800 border-red-300`;
      default:
        return `${base} bg-gray-100 text-gray-800 border-gray-300`;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto p-4">
          <BackButton />
          <p className="text-gray-500 mt-4 text-center text-lg">
            Cargando reportes...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <BackButton />

        <h1 className="text-3xl font-bold text-purple-700 mb-3">
          Reportes
        </h1>

        {reportes.length === 0 ? (
          <p className="text-gray-500">No hay reportes.</p>
        ) : (
          reportes.map((r) => (
            <Card
              key={r.id}
              className="p-6 w-full border border-purple-100 shadow-md rounded-xl bg-white"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-lg font-bold text-purple-700">
                    Reporte #{r.id}
                  </p>

                  {objetivos[r.id] && (
                    <p className="text-sm text-gray-700">
                      <strong>Objetivo:</strong>{" "}
                      <Link
                        to={objetivos[r.id].link}
                        className="text-purple-600 hover:text-purple-800 hover:underline font-medium"
                      >
                        {objetivos[r.id].nombre}
                      </Link>
                    </p>
                  )}

                  <p className="text-sm text-gray-700">
                    <strong>Motivo:</strong> {r.motivo}
                  </p>

                  <p className="text-sm text-gray-700">
                    <strong>Reportado por:</strong>{" "}
                    {r.usuarioReporta.nombreUsuario}
                  </p>
                </div>

                <span className={getBadge(r.estado)}>
                  {r.estado.toUpperCase()}
                </span>
              </div>

              <div className="flex gap-3 mt-5">

                {r.estado === "pendiente" && (
                  <>
                    <button
                      onClick={() => resolverReporte(r.id).then(load)}
                      className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
                    >
                      Resolver
                    </button>

                    <button
                      onClick={() => rechazarReporte(r.id).then(load)}
                      className="px-4 py-2 rounded-lg bg-purple-300 text-purple-800 hover:bg-purple-400 shadow-sm"
                    >
                      Rechazar
                    </button>
                  </>
                )}

                <button
                  onClick={() => eliminarReporte(r.id).then(load)}
                  className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 shadow-sm"
                >
                  Eliminar
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </Layout>
  );
}
