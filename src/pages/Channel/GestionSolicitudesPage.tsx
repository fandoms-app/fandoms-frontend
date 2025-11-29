import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import BackButton from "../../components/Common/BackButton";
import {
  obtenerSolicitudesCanal,
  aprobarSolicitudCanal,
  rechazarSolicitudCanal
} from "../../api/solicitudCanalApi";
import type { SolicitudCanal } from "../../types/solicitudCanal";

export default function GestionSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudCanal[]>([]);

  const load = async () => {
    const data = await obtenerSolicitudesCanal();
    setSolicitudes(data);
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <BackButton />

        <h1 className="text-3xl font-bold text-purple-700">
          Gestión de Solicitudes
        </h1>

        <div className="space-y-4">
          {solicitudes.map((s) => (
            <div
              key={s.id}
              className="bg-white p-5 rounded-xl shadow-md border border-purple-200"
            >
              <p><b>Nombre:</b> {s.nombre}</p>
              <p><b>Descripción:</b> {s.descripcion}</p>

              {s.idCanalPadre && (
                <p>
                  <b>Subcanal de:</b>{" "}
                  {s.canalPadre?.nombreCanal ?? "Desconocido"}
                </p>
              )}

              <p><b>Estado:</b> {s.estado}</p>
              <p><b>Solicitado por:</b> {s.usuario.nombreUsuario}</p>

              <div className="flex gap-2 mt-4">
                {s.estado === "pendiente" && (
                  <>
                    <button
                      className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                      onClick={() => aprobarSolicitudCanal(s.id).then(load)}
                    >
                      Aprobar
                    </button>

                    <button
                      className="px-3 py-1 bg-purple-300 text-purple-800 rounded hover:bg-purple-400 transition"
                      onClick={() => rechazarSolicitudCanal(s.id).then(load)}
                    >
                      Rechazar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
