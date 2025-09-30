import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ChannelCard from "../components/ChannelCard";
import type { Canal } from "../types";
import { getMyFollowedCanales } from "../api/canalApi";
import BackButton from "../components/BackButton";

export default function FollowingChannels() {
  const [canales, setCanales] = useState<Canal[]>([]);

  useEffect(() => {
    getMyFollowedCanales()
      .then((res) => setCanales(res.data))
      .catch((err) => console.error("Error cargando canales seguidos", err));
  }, []);

  const grouped = canales.reduce<Record<string, Canal[]>>((acc, canal) => {
    const parentKey = canal.idCanalPadre ?? canal.id;
    if (!acc[parentKey]) acc[parentKey] = [];
    acc[parentKey].push(canal);
    return acc;
  }, {});

  return (
    <Layout>
      <div className="w-full max-w-6xl space-y-8">
        <BackButton />
        <h1 className="text-2xl font-bold text-purple-600">Canales seguidos</h1>

        {Object.entries(grouped).map(([parentId, subs]) => {
          const parent = canales.find((c) => c.id === parentId);

          return (
            <div key={parentId} className="space-y-3">
              <h2 className="font-semibold text-lg text-purple-700">
                {parent ? parent.nombreCanal : "Otros canales"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {subs.map((canal) => (
                  <ChannelCard key={canal.id} canal={canal} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
