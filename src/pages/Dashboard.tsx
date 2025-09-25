import Layout from "../components/Layout";
import Card from "../components/Card";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    return (
      <Layout>
        <p>Cargando perfil...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card className="text-center">
        <h1 className="text-2xl font-bold text-purple-600 mb-4">
          Bienvenido, {user?.nombreUsuario ?? "Usuario"}
        </h1>
        <p className="text-gray-700">
          Este es tu Dashboard. Desde aquí vas a poder explorar y gestionar tu
          actividad.
        </p>
      </Card>
    </Layout>
  );
}
