import { Link, useNavigate } from "react-router-dom";
import Card from "./Card";
import type { Canal } from "../types";
import useAuth from "../hooks/useAuth";
import ActionMenu from "./ActionMenu";
import { deleteCanal } from "../api/canalApi";

interface Props {
  canal: Canal;
  showDescription?: boolean;
  showFollowButton?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  isFollowing?: boolean;
}

export default function ChannelCard({
  canal,
  showDescription = true,
  showFollowButton = false,
  onFollow,
  onUnfollow,
  isFollowing,
}: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteCanal(canal.id);
      navigate("/canales");
    } catch (err) {
      console.error("No se pudo borrar canal", err);
      alert("No se pudo eliminar el canal.");
    }
  };

  return (
    <Card className="p-4 space-y-2 hover:shadow-md transition">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-bold text-lg text-purple-700">
          <Link to={`/canales/${canal.id}`} className="hover:underline">
            {canal.nombreCanal}
          </Link>
        </h2>

        <div className="flex items-center gap-2">
          {showFollowButton && (
            <button
              onClick={isFollowing ? onUnfollow : onFollow}
              className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition text-sm"
            >
              {isFollowing ? "Dejar de seguir" : "Seguir"}
            </button>
          )}

          {user && (
            <ActionMenu
              tipo="canal"
              idObjetivo={canal.id}
              esPropietario={false}
              onEdit={() => navigate(`/canales/${canal.id}/editar`)}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {showDescription && (
        <p className="text-gray-600">
          {canal.descripcion || "Sin descripción"}
        </p>
      )}

      <p className="text-sm text-gray-500">
        {canal.followersCount}{" "}
        {canal.followersCount === 1 ? "seguidor" : "seguidores"}
      </p>
    </Card>
  );
}
