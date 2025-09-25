import type { Usuario } from "../types";

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
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
      {user.avatar && (
        <img
          src={user.avatar}
          alt={`Avatar de ${user.nombreUsuario}`}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
      )}

      <h2 className="text-2xl font-bold text-purple-600 mb-2">
        {user.nombreUsuario}
      </h2>

      <p className="text-gray-700">{user.bio || "Sin biografía"}</p>
      <p className="mt-2 text-sm text-gray-500">📧 {user.email}</p>
      {user.fechaNacimiento && (
        <p className="text-sm text-gray-500">
          🎂 {new Date(user.fechaNacimiento).toLocaleDateString("es-AR")}
        </p>
      )}

      {user.rol !== "usuario" && (
        <p className="mt-2 text-sm">
          <strong>Rol:</strong> {user.rol}
        </p>
      )}

      {typeof user.seguidoresCount === "number" && (
        <p className="mt-2 text-sm">
          👥 Seguidores: {user.seguidoresCount}
        </p>
      )}
      {typeof user.seguidosCount === "number" && (
        <p className="text-sm">
          ➡️ Seguidos: {user.seguidosCount}
        </p>
      )}

      {!isOwnProfile && showFollow && (
        <button
          onClick={isFollowing ? onUnfollow : onFollow}
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
        >
          {isFollowing ? "Dejar de seguir" : "Seguir"}
        </button>
      )}

      {onEdit && (
        <button
          onClick={onEdit}
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
        >
          Editar perfil
        </button>
      )}
    </div>
  );
}
