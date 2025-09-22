import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { updateMe } from "../api/usuarioApi";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreUsuario: user?.nombreUsuario ?? "",
    email: user?.email ?? "",
    bio: user?.bio ?? "",
    avatar: user?.avatar ?? "",
    fechaNacimiento: user?.fechaNacimiento
      ? user.fechaNacimiento.slice(0, 10)
      : "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = Object.fromEntries(
      Object.entries(form).filter(([key, v]) => {
        if (["bio", "avatar"].includes(key)) return v !== undefined;
        return v !== "" && v !== undefined;
      })
    );


    try {
      const res = await updateMe(data);
      setUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.error("Error actualizando perfil", err);
      alert("No se pudo actualizar el perfil");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar perfil</h2>

      <input
        type="text"
        name="nombreUsuario"
        value={form.nombreUsuario}
        onChange={handleChange}
        placeholder="Nombre de usuario"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Correo"
      />
      <input
        type="text"
        name="avatar"
        value={form.avatar}
        onChange={handleChange}
        placeholder="URL de avatar"
      />
      <textarea
        name="bio"
        value={form.bio}
        onChange={handleChange}
        placeholder="Biografía"
      />
      <input
        type="date"
        name="fechaNacimiento"
        value={form.fechaNacimiento}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Nueva contraseña (opcional)"
      />

      <button type="submit">Guardar cambios</button>
    </form>
  );
}
