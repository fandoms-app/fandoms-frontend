import { useEffect, useState } from "react";
import {
  obtenerReportes,
  resolverReporte,
  rechazarReporte,
  eliminarReporte
} from "../api/reporteApi";
import type { Reporte } from "../types";

import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import Card from "../components/Card";

export default function ReportesPage() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await obtenerReportes();
      setReportes(data);
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
      "px-2 py-1 rounded text-xs font-bold border inline-block";

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
          <p className="text-gray-500 mt-4">Cargando reportes...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-purple-700">
          Reportes
        </h1>

        {reportes.length === 0 ? (
          <p className="text-gray-500">No hay reportes.</p>
        ) : (
          reportes.map((r) => (
            <Card key={r.id} className="p-6 w-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold text-purple-700">
                    Reporte #{r.id}
                  </p>
                  <p className="text-sm mt-1">
                    <strong>Tipo:</strong> {r.tipo}
                  </p>
                  <p className="text-sm">
                    <strong>Motivo:</strong> {r.motivo}
                  </p>
                  <p className="text-sm mt-2">
                    <strong>Reportado por:</strong>{" "}
                    {r.usuarioReporta.nombreUsuario}
                  </p>
                </div>

                <span className={getBadge(r.estado)}>
                  {r.estado.toUpperCase()}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                {r.estado === "pendiente" && (
                  <>
                    <button
                      onClick={() => resolverReporte(r.id).then(load)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Resolver
                    </button>

                    <button
                      onClick={() => rechazarReporte(r.id).then(load)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Rechazar
                    </button>
                  </>
                )}

                <button
                  onClick={() => eliminarReporte(r.id).then(load)}
                  className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800"
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
