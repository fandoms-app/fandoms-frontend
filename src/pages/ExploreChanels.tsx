import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ChannelCard from "../components/ChannelCard";
import type { Canal } from "../types";
import { getRootCanales } from "../api/canalApi";
import BackButton from "../components/BackButton";
import useAuth from "../hooks/useAuth";
import CreateSolicitudCanalModal from "../pages/CreateSolicitudCanalModal";

export default function ExploreChannels() {
  const [canales, setCanales] = useState<Canal[]>([]);
  const { user } = useAuth();

  const [openSolicitudModal, setOpenSolicitudModal] = useState(false);

  useEffect(() => {
    getRootCanales()
      .then((res) => setCanales(res.data))
      .catch((err) => console.error("Error cargando canales", err));
  }, []);

  return (
    <Layout>
      <div className="w-full space-y-6">
        <BackButton />

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-600">
            Explorar canales
          </h1>

          {user && (
            <button
              onClick={() => setOpenSolicitudModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Solicitar canal
            </button>
          )}
        </div>

        {openSolicitudModal && (
          <CreateSolicitudCanalModal
            parentId={null}
            onClose={() => setOpenSolicitudModal(false)}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {canales.map((canal) => (
            <ChannelCard key={canal.id} canal={canal} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
