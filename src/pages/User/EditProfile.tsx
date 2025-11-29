import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { updateMe } from "../../api/usuarioApi";
import Layout from "../../components/Layout/Layout";
import BackButton from "../../components/Common/BackButton";
import Card from "../../components/Card/Card";
import { ProfileAvatarUploader } from "../../components/User/ProfileAvatarUploader";
import FormInput from "../../components/Common/FormInput";

export default function EditProfile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreUsuario: user?.nombreUsuario ?? "",
    email: user?.email ?? "",
    bio: user?.bio ?? "",
    fechaNacimiento: user?.fechaNacimiento
      ? user.fechaNacimiento.slice(0, 10)
      : "",
    password: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== "" && v !== undefined)
    );

    try {
      const res = await updateMe(data);
      await refreshUser();
      navigate(`/usuarios/${res.data.id}`);
    } catch (err) {
      console.error("Error actualizando perfil", err);
      alert("No se pudo actualizar el perfil");
    }
  };

  const handleAvatarUpload = async () => {
    try {
      await refreshUser();
    } catch (err) {
      console.error("Error refrescando usuario", err);
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

          <div className="flex justify-center mb-4">
            <ProfileAvatarUploader
              currentAvatar={user?.avatar ?? null}
              onUploadSuccess={handleAvatarUpload}
            />
          </div>

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
