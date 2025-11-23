import React, { useState, type JSX } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import useAuthError from "../hooks/useAuthError";

export default function LoginPage(): JSX.Element {
  const { login, loginWithGoogle } = useAuth();
  const { parseError } = useAuthError();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>

      <form onSubmit={onSubmit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          type="password"
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-purple-600 text-white rounded"
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </form>

      <div className="my-3 text-center">
        <button onClick={onGoogle} disabled={loading} className="px-4 py-2 border rounded">
          Ingresar con Google
        </button>
      </div>

      <div className="text-center">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="text-purple-600">
          Registrate
        </Link>
      </div>

      {error && <div className="mt-3 text-red-600">{error}</div>}
    </div>
  );
}
