import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import useAuth from "../../hooks/useAuth";
import {
  getCanal,
  getCanalFollowers,
  followCanal,
  unfollowCanal,
  getSubCanales,
} from "../../api/canalApi";
import SubchannelCard from "../../components/Channel/SubchannelCard";
import BackButton from "../../components/Common/BackButton";

import { getPublicacionesByCanal } from "../../api/publicacionApi";
import CreateSolicitudCanalModal from "./CreateSolicitudCanalModal";
import { esStaff } from "../../utils/roles";
import ChannelHeader from "../../components/Channel/ChannelHeader";
import CreatePublication from "../Publication/CreatePublication";
import PublicationCard from "../../components/Publication/PublicationCard";
import type { Canal } from "../../types/canal";
import type { Publicacion } from "../../types/publicacion";

export default function ChannelDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [canal, setCanal] = useState<Canal | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [subCanales, setSubCanales] = useState<Canal[]>([]);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loadingPubs, setLoadingPubs] = useState(false);

  const [openSolicitudModal, setOpenSolicitudModal] = useState(false);

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

    getCanal(id).then((res) => setCanal(res.data));
    getSubCanales(id).then((res) => setSubCanales(res.data));
    loadPublicaciones(id);

    if (user) {
      getCanalFollowers(id)
        .then((res) => setIsFollowing(res.data.some((s) => s.id === user.id)))
        .catch(console.error);
    }
  }, [id, user]);

  const handleFollow = async () => {
    if (!canal) return;
    try {
      await followCanal(canal.id);
      setIsFollowing(true);
      setCanal((c) =>
        c ? { ...c, followersCount: (c.followersCount ?? 0) + 1 } : c
      );
    } catch (err) {
      console.error("Error al seguir canal", err);
    }
  };

  const handleUnfollow = async () => {
    if (!canal) return;
    try {
      await unfollowCanal(canal.id);
      setIsFollowing(false);
      setCanal((c) =>
        c
          ? { ...c, followersCount: Math.max(0, (c.followersCount ?? 0) - 1) }
          : c
      );
    } catch (err) {
      console.error("Error al dejar de seguir canal", err);
    }
  };

  if (!canal) return <p>Cargando canal...</p>;

  return (
    <Layout>
      <div className="w-full max-w-4xl space-y-8">
        <BackButton />

        <ChannelHeader
          canal={canal}
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

        {canal.idCanalPadre === null && user && (
          <>
            {!esStaff(user.rol) && (
              <button
                onClick={() => setOpenSolicitudModal(true)}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
              >
                Solicitar subcanal
              </button>
            )}

            {esStaff(user.rol) && (
              <button
                onClick={() => navigate(`/create-channel/${canal.id}`)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
              >
                Crear subcanal
              </button>
            )}
          </>
        )}

        {openSolicitudModal && (
          <CreateSolicitudCanalModal
            parentId={canal.id}
            onClose={() => setOpenSolicitudModal(false)}
          />
        )}

        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-bold text-lg text-purple-700 mb-2">
            Publicaciones
          </h2>

          {user && (
            <CreatePublication
              idCanal={canal.id}
              onCreated={() => loadPublicaciones(canal.id)}
            />
          )}

          {loadingPubs ? (
            <p>Cargando publicaciones...</p>
          ) : publicaciones.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Aún no hay publicaciones en este canal.
            </p>
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
