import React, { useState, type JSX } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useAuthError from "../hooks/useAuthError";

export default function RegisterPage(): JSX.Element {
  const { register } = useAuth();
  const { parseError } = useAuthError();
  const navigate = useNavigate();

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register({ nombreUsuario, email, password, fechaNacimiento });
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Crear cuenta</h2>

      <form onSubmit={onSubmit}>
        <input
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          placeholder="Nombre de usuario"
          className="w-full mb-3 p-2 border rounded"
          required
        />

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
          minLength={6}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          placeholder="Fecha de nacimiento (YYYY-MM-DD)"
          type="date"
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-purple-600 text-white rounded"
        >
          {loading ? "Creando..." : "Registrarme"}
        </button>
      </form>

      {error && <div className="mt-3 text-red-600">{error}</div>}
    </div>
  );
}
