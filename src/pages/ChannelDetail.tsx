import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ChannelCard from "../components/ChannelCard";
import useAuth from "../hooks/useAuth";
import type { Canal, Publicacion } from "../types";
import {
  getCanal,
  getCanalFollowers,
  followCanal,
  unfollowCanal,
  getSubCanales,
} from "../api/canalApi";
import SubchannelCard from "../components/SubchannelCard";
import BackButton from "../components/BackButton";
import CreatePublication from "./CreatePublication";
import PublicationCard from "../components/PublicationCard";
import { getPublicacionesByCanal } from "../api/publicacionApi";

export default function ChannelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [canal, setCanal] = useState<Canal | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [subCanales, setSubCanales] = useState<Canal[]>([]);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loadingPubs, setLoadingPubs] = useState(false);

  const loadPublicaciones = async (canalId: string) => {
    try {
      setLoadingPubs(true);
      const res = await getPublicacionesByCanal(canalId);
      setPublicaciones(res.data);
    } catch (err) {
      console.error("Error cargando publicaciones", err);
    } finally {
      setLoadingPubs(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    getCanal(id).then((res) => setCanal(res.data)).catch(console.error);
    getSubCanales(id).then((res) => setSubCanales(res.data)).catch(console.error);
    loadPublicaciones(id);

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

  if (!canal) return <p>Cargando canal...</p>;

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

        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-bold text-lg text-purple-700 mb-2">Publicaciones</h2>

          {user && (
            <CreatePublication
              idCanal={canal.id}
              onCreated={() => loadPublicaciones(canal.id)}
            />
          )}

          {loadingPubs ? (
            <p>Cargando publicaciones...</p>
          ) : publicaciones.length === 0 ? (
            <p className="text-gray-500 text-sm">Aún no hay publicaciones en este canal.</p>
          ) : (
            <div className="space-y-4">
              {publicaciones.map((pub) => (
                <PublicationCard
                  key={pub.id}
                  publicacion={pub}
                  onRefresh={() => loadPublicaciones(canal.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
