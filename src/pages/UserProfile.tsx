import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import type { Usuario } from "../types";
import { useAuth } from "../hooks/useAuth";

interface UserProfileData extends Usuario {
  seguidoresCount: number;
  seguidosCount: number;
}

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!id) return;

    api
      .get<UserProfileData>(`/usuario/${id}/profile`)
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.error("Error cargando perfil", err);
      });

    if (user) {
      api
        .get<Usuario[]>(`/usuario/${id}/seguidores`)
        .then((res) => {
          setIsFollowing(res.data.some((f) => f.id === user.id));
        })
        .catch((err) => console.error("Error verificando seguimiento", err));
    }
  }, [id, user]);

  const handleFollow = async () => {
    if (!id) return;
    try {
      await api.post(`/usuario/${id}/follow`);
      setIsFollowing(true);
      setProfile((prev) =>
        prev ? { ...prev, seguidoresCount: prev.seguidoresCount + 1 } : prev
      );
    } catch (err) {
      console.error("Error al seguir", err);
    }
  };

  const handleUnfollow = async () => {
    if (!id) return;
    try {
      await api.delete(`/usuario/${id}/follow`);
      setIsFollowing(false);
      setProfile((prev) =>
        prev ? { ...prev, seguidoresCount: prev.seguidoresCount - 1 } : prev
      );
    } catch (err) {
      console.error("Error al dejar de seguir", err);
    }
  };

  if (!profile) return <p>Cargando...</p>;

  return (
    <div>
      <h2>{profile.nombreUsuario}</h2>
      {profile.avatar && <img src={profile.avatar} alt="Avatar" width={100} height={100} />}
      <p>{profile.bio || "Sin biografía"}</p>
      <p><strong>Seguidores:</strong> {profile.seguidoresCount}</p>
      <p><strong>Seguidos:</strong> {profile.seguidosCount}</p>

      {user && user.id !== profile.id && (
        isFollowing ? (
          <button onClick={handleUnfollow}>Dejar de seguir</button>
        ) : (
          <button onClick={handleFollow}>Seguir</button>
        )
      )}
    </div>
  );
}
