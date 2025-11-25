import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Canal } from "../types";
import { getAllCanales, getMyFollowedCanales } from "../api/canalApi";
import ChannelCard from "../components/ChannelCard";
import ListPreview from "../components/ListPreview";

export default function DashboardUser() {
  const [explorePreview, setExplorePreview] = useState<Canal[]>([]);
  const [followingPreview, setFollowingPreview] = useState<Canal[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const allResp = await getAllCanales();
        const all = allResp.data;
        setExplorePreview(all.slice(0, 4));

        const followedResp = await getMyFollowedCanales();
        const followed = followedResp.data;
        setFollowingPreview(followed.slice(0, 4));
      } catch (err) {
        console.error("Error cargando dashboard usuario:", err);
      }
    };
    void load();
  }, []);

  return (
    <div className="p-6 space-y-10">

      <h1 className="text-3xl font-bold text-purple-700">
        Bienvenido ✨
      </h1>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-purple-700">
            Explorar canales
          </h2>
          <Link to="/explore" className="text-purple-600 hover:underline">
            Ver todos
          </Link>
        </div>

        <ListPreview<Canal>
          items={explorePreview}
          emptyMessage="No hay canales disponibles."
          render={(c) => (
            <ChannelCard key={c.id} canal={c} showFollowButton={false} />
          )}
        />
      </section>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-purple-700">
            Tus canales favoritos 💜
          </h2>
          <Link to="/following" className="text-purple-600 hover:underline">
            Ver todos
          </Link>
        </div>

        <ListPreview<Canal>
          items={followingPreview}
          emptyMessage="Aún no sigues canales."
          render={(c) => (
            <ChannelCard key={c.id} canal={c} showFollowButton={false} />
          )}
        />
      </section>

    </div>
  );
}
