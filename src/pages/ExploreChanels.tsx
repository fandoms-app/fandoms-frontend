import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ChannelCard from "../components/ChannelCard";
import type { Canal } from "../types";
import { getRootCanales } from "../api/canalApi";
import BackButton from "../components/BackButton";

export default function ExploreChannels() {
  const [canales, setCanales] = useState<Canal[]>([]);

  useEffect(() => {
    getRootCanales()
      .then((res) => setCanales(res.data))
      .catch((err) => console.error("Error cargando canales", err));
  }, []);

  return (
    <Layout>
      <div className="w-full space-y-4">
        <BackButton />
        <h1 className="text-2xl font-bold text-purple-600">Explorar canales</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {canales.map((canal) => (
            <ChannelCard key={canal.id} canal={canal} />
          ))}
        </div>
      </div>
    </Layout>

  );
}
