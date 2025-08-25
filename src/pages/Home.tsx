import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Bienvenido al Home</h1>
      <p>Esta es una página protegida solo para usuarios logueados.</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
