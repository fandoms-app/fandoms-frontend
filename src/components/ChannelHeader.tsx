import { useNavigate } from "react-router-dom";
import type { Canal } from "../types";
import useAuth from "../hooks/useAuth";
import ActionMenu from "./ActionMenu";

interface Props {
  canal: Canal;
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
}

export default function ChannelHeader({
  canal,
  isFollowing,
  onFollow,
  onUnfollow
}: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow overflow-visible relative">

      <div className="h-28 w-full rounded-t-2xl bg-gradient-to-r from-purple-300 to-purple-100"></div>

      <div className="p-6 -mt-8 relative z-20">
        <div className="flex items-start justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-purple-700 drop-shadow-sm">
              {canal.nombreCanal}
            </h1>

            {canal.descripcion && (
              <p className="text-gray-700 max-w-xl mt-2">
                {canal.descripcion}
              </p>
            )}

            <p className="text-sm text-gray-500 mt-2">
              {canal.followersCount ?? 0} seguidores
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-30">

            <button
              onClick={isFollowing ? onUnfollow : onFollow}
              className={`
                px-4 py-2 rounded-xl font-medium transition shadow-sm
                ${isFollowing
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-purple-600 text-white hover:bg-purple-700"}
              `}
            >
              {isFollowing ? "Siguiendo" : "Seguir"}
            </button>

            {user && (
              <ActionMenu
                tipo="canal"
                idObjetivo={canal.id}
                esPropietario={false}
                onEdit={() => navigate(`/canales/${canal.id}/editar`)}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
