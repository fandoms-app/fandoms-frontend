import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getPublicacionById, updatePublicacion } from "../api/publicacionApi";
import type { Publicacion } from "../types";

export default function EditPublication() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const res = await getPublicacionById(id);
        const pub: Publicacion = res.data;
        setTitulo(pub.titulo ?? "");
        setContenido(pub.contenido ?? "");
      } catch (err) {
        console.error("Error cargando publicación", err);
        alert("Error al cargar la publicación.");
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setLoading(true);
      await updatePublicacion(id, { titulo, contenido });
      alert("Publicación actualizada con éxito.");
      navigate(`/publicaciones/${id}`);
    } catch (err) {
      console.error("Error al actualizar la publicación", err);
      alert("No se pudo actualizar la publicación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white shadow rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-purple-700">Editar publicación</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
            className="w-full border p-2 rounded"
          />
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            rows={6}
            placeholder="Contenido"
            className="w-full border p-2 rounded resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
