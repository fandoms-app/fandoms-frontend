import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import type { Usuario } from "../types";
import axios from "axios";

export default function Dashboard() {
  const { user, logout, loadingUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  if (loadingUser) {
    return <p>Cargando perfil...</p>;
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!search.trim()) {
      setError("Ingresá un nombre de usuario");
      return;
    }

    try {
      const res = await api.get<Usuario>(`/usuario/search/${search}`);
      navigate(`/users/${res.data.id}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError("Usuario no encontrado");
        } else {
          setError("Error inesperado, intenta más tarde");
        }
      } else {
        setError("Error desconocido");
      }
    }
  };

  return (
    <div>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        <div>
          <button onClick={() => navigate("/explore")}>Explorar canales</button>
          <button onClick={() => navigate("/following")}>Canales seguidos</button>

          <form
            onSubmit={handleSearch}
            style={{ display: "inline-block", marginLeft: "1rem" }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar usuario..."
              style={{ marginRight: "0.5rem" }}
            />
            <button type="submit">Buscar</button>
          </form>
        </div>

        <div style={{ position: "relative" }}>
          <button onClick={toggleMenu}>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            ) : (
              "👤"
            )}
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                background: "white",
                border: "1px solid #ccc",
                padding: "0.5rem",
              }}
            >
              <button onClick={() => navigate("/edit-profile")}>
                Editar perfil
              </button>
              <button onClick={logout}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </nav>

      <main style={{ padding: "1rem" }}>
        <h1>Bienvenido, {user?.nombreUsuario ?? "Usuario"}</h1>
        <p>
          Este es tu Dashboard. Desde aquí vas a poder explorar y gestionar tu
          actividad.
        </p>

        {error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
        )}
      </main>
    </div>
  );
}
