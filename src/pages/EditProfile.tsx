import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { updateMe } from "../api/usuarioApi";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Layout from "../components/Layout";
import FormInput from "../components/FormImput";
import BackButton from "../components/BackButton";

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
      navigate(`/users/${res.data.id}`);
    } catch (err) {
      console.error("Error actualizando perfil", err);
      alert("No se pudo actualizar el perfil");
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-md space-y-4">
        <BackButton />
        <Card>
          <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
            Editar perfil
          </h2>
          <form onSubmit={handleSubmit}>
            <FormInput
              type="text"
              name="nombreUsuario"
              value={form.nombreUsuario}
              onChange={handleChange}
              placeholder="Nombre de usuario"
            />
            <FormInput
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Correo"
            />
            <FormInput
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
              className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <FormInput
              type="date"
              name="fechaNacimiento"
              value={form.fechaNacimiento}
              onChange={handleChange}
            />
            <FormInput
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nueva contraseña (opcional)"
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition"
            >
              Guardar cambios
            </button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
