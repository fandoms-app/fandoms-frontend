import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

interface UserResult {
  id: string;
  nombreUsuario: string;
  avatar?: string;
}

interface CanalResult {
  id: string;
  nombreCanal: string;
  descripcion?: string;
}

interface SearchResponse {
  usuarios: UserResult[];
  canales: CanalResult[];
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      setShowDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get<SearchResponse>(`/usuario/search?q=${query}`);
        setResults(res.data);
        setShowDropdown(true);
      } catch (err) {
        console.error("Error en búsqueda", err);
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelectUser = (user: UserResult) => {
    setQuery("");
    setResults(null);
    setShowDropdown(false);
    navigate(`/users/${user.id}`);
  };

  const handleSelectCanal = (canal: CanalResult) => {
    setQuery("");
    setResults(null);
    setShowDropdown(false);
    navigate(`/channels/${canal.id}`);
  };

  return (
    <div className="relative w-80">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setShowDropdown(true)}
        placeholder="Buscar..."
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {showDropdown && results && (
        <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg max-h-72 overflow-y-auto z-50">
          {results.usuarios.length > 0 && (
            <div>
              <h4 className="px-3 py-2 text-xs font-semibold text-gray-500">
                Usuarios
              </h4>
              {results.usuarios.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 text-left"
                >
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.nombreUsuario}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="font-medium text-gray-800">
                    {user.nombreUsuario}
                  </span>
                  <span className="text-sm text-gray-500 ml-auto">👤</span>
                </button>
              ))}
            </div>
          )}

          {results.canales.length > 0 && (
            <div>
              <h4 className="px-3 py-2 text-xs font-semibold text-gray-500">
                Canales
              </h4>
              {results.canales.map((canal) => (
                <button
                  key={canal.id}
                  onClick={() => handleSelectCanal(canal)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 text-left"
                >
                  <span className="font-medium text-purple-700">
                    {canal.nombreCanal}
                  </span>
                  <span className="text-sm text-gray-500 ml-auto">📺</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {showDropdown && query.length >= 2 && !loading && results && results.usuarios.length === 0 && results.canales.length === 0 && (
        <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg p-3 text-gray-500 z-50">
          No se encontraron resultados
        </div>
      )}

      {loading && (
        <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg p-3 text-gray-500 z-50">
          Buscando...
        </div>
      )}
    </div>
  );
}
