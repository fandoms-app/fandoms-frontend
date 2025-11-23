import { useNavigate } from "react-router-dom";
import type { Usuario } from "../types";
import ActionMenu from "./ActionMenu";
import useAuth from "../hooks/useAuth";
import { deleteUser } from "../api/usuarioApi";

interface ProfileCardProps {
  user: Usuario & {
    seguidoresCount?: number;
    seguidosCount?: number;
  };
  onEdit?: () => void;
  onFollow?: () => void;
  onUnfollow?: () => void;
  isFollowing?: boolean;
  showFollow?: boolean;
  isOwnProfile?: boolean;
}

export default function ProfileCard({
  user,
  onEdit,
  onFollow,
  onUnfollow,
  isFollowing,
  showFollow = false,
  isOwnProfile = false,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const getRoleBadgeClasses = (rol: string) => {
    switch (rol.toUpperCase()) {
      case "ADMIN":
        return "bg-purple-200 text-purple-900 border border-purple-400";
      case "MOD":
      case "MODERADOR":
        return "bg-purple-100 text-purple-700 border border-purple-300";
      default:
        return "bg-purple-50 text-purple-600 border border-purple-200";
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar usuario? Esta acción es irreversible.")) return;
    try {
      await deleteUser(user.id);
      navigate("/");
    } catch (err) {
      console.error("No se pudo eliminar usuario", err);
      alert("No se pudo eliminar el usuario.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center relative">
      {authUser && (
        <div className="absolute top-4 right-4">
          <ActionMenu
            tipo="usuario"
            idObjetivo={user.id}
            esPropietario={isOwnProfile}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {user.avatar && (
        <img src={user.avatar} alt={`Avatar de ${user.nombreUsuario}`} className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-purple-200" />
      )}

      <h2 className="text-2xl font-bold text-purple-700 mb-1">{user.nombreUsuario}</h2>

      {user.rol && (
        <div className="flex justify-center mb-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getRoleBadgeClasses(user.rol)}`}>
            {user.rol.toUpperCase()}
          </span>
        </div>
      )}

      <p className="text-gray-700">{user.bio || "Sin biografía"}</p>

      {isOwnProfile && <p className="mt-2 text-sm text-gray-500">📧 {user.email}</p>}

      {user.fechaNacimiento && <p className="text-sm text-gray-500">🎂 {new Date(user.fechaNacimiento).toLocaleDateString("es-AR")}</p>}

      {typeof user.seguidoresCount === "number" && <p className="mt-2 text-sm">👥 Seguidores: {user.seguidoresCount}</p>}
      {typeof user.seguidosCount === "number" && <p className="text-sm">➡️ Seguidos: {user.seguidosCount}</p>}

      {!isOwnProfile && showFollow && (
        <button onClick={isFollowing ? onUnfollow : onFollow} className="mt-4 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition">
          {isFollowing ? "Dejar de seguir" : "Seguir"}
        </button>
      )}

      {onEdit && isOwnProfile && (
        <button onClick={onEdit} className="mt-4 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition">
          Editar perfil
        </button>
      )}
    </div>
  );
}
