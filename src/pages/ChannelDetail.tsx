import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ChannelCard from "../components/ChannelCard";
import { useAuth } from "../hooks/useAuth";
import type { Canal } from "../types";
import {
  getCanal,
  getCanalFollowers,
  followCanal,
  unfollowCanal,
  getSubCanales,
} from "../api/canalApi";
import SubchannelCard from "../components/SubchannelCard";
import BackButton from "../components/BackButton";

export default function ChannelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [canal, setCanal] = useState<Canal | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [subCanales, setSubCanales] = useState<Canal[]>([]);

  useEffect(() => {
    if (!id) return;

    getCanal(id).then((res) => setCanal(res.data)).catch(console.error);
    getSubCanales(id).then((res) => setSubCanales(res.data)).catch(console.error);

    if (user) {
      getCanalFollowers(id)
        .then((res) => setIsFollowing(res.data.some((s) => s.id === user.id)))
        .catch(console.error);
    }
  }, [id, user]);

  const handleFollow = async () => {
    if (!id) return;
    try {
      await followCanal(id);
      setIsFollowing(true);
    } catch (err) {
      console.error("Error al seguir canal", err);
    }
  };

  const handleUnfollow = async () => {
    if (!id) return;
    try {
      await unfollowCanal(id);
      setIsFollowing(false);
    } catch (err) {
      console.error("Error al dejar de seguir canal", err);
    }
  };

  if (!canal) return <p>Cargando...</p>;

  return (
    <Layout>
      <div className="w-full max-w-4xl space-y-8">
        <BackButton />

        <ChannelCard
          canal={canal}
          showFollowButton={!!user}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
        />

        {subCanales.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow space-y-4">
            <h2 className="font-bold text-lg text-purple-700">Subcanales</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {subCanales.map((sub) => (
                <SubchannelCard key={sub.id} canal={sub} />
              ))}
            </div>
          </div>
        )}

        {canal.idCanalPadre === null && (
          <button
            onClick={() => navigate(`/create-channel/${canal.id}`)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            Crear subcanal
          </button>
        )}

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg text-purple-700 mb-2">
            Publicaciones
          </h2>
          <p className="text-gray-500 text-sm">
            Aquí se mostrarán las publicaciones de este canal.
          </p>
        </div>
      </div>
    </Layout>
  );
}
