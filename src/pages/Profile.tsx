import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <p>No hay usuario logueado</p>;
  }

  return (
    <div>
      <h2>Mi perfil</h2>

      {user.avatar && (
        <img
          src={user.avatar}
          alt={`Avatar de ${user.nombreUsuario}`}
          width={120}
          height={120}
        />
      )}

      <p><strong>Nombre de usuario:</strong> {user.nombreUsuario}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Bio:</strong> {user.bio || "Sin bio"}</p>
      <p>
        <strong>Fecha de nacimiento:</strong>{" "}
        {user.fechaNacimiento
          ? new Date(user.fechaNacimiento).toLocaleDateString("es-AR")
          : "No especificada"}
      </p>
      <p><strong>Rol:</strong> {user.rol}</p>

      <button onClick={() => navigate("/edit-profile")}>
        Editar perfil
      </button>
    </div>
  );
}
