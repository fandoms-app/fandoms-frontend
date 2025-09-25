import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

interface SearchResult {
  id: string;
  nombreUsuario: string;
  avatar?: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get<SearchResult[]>(`/usuario/search?q=${query}`);
        setResults(res.data);
        setShowDropdown(true);
      } catch (err) {
        console.error("Error en búsqueda", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (user: SearchResult) => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    navigate(`/users/${user.id}`);
  };

  return (
    <div className="relative w-80">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setShowDropdown(true)}
        placeholder="Buscar usuarios..."
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {showDropdown && results.length > 0 && (
        <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
          {results.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelect(user)}
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
              <span className="text-sm text-gray-500 ml-auto">👤 Usuario</span>
            </button>
          ))}
        </div>
      )}

      {showDropdown && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg p-3 text-gray-500 z-50">
          No se encontraron usuarios
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
