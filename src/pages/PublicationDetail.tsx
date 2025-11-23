import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import PublicationCard from "../components/PublicationCard";
import { getPublicacionById, replyToPublicacion } from "../api/publicacionApi";
import type { Publicacion } from "../types";

export default function PublicationDetail() {
  const { id } = useParams<{ id: string }>();
  const [pub, setPub] = useState<Publicacion | null>(null);
  const [replyText, setReplyText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loadingReply, setLoadingReply] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const res = await getPublicacionById(id);
      setPub(res.data);
    } catch (err) {
      console.error("Error cargando publicación", err);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || (!replyText.trim() && !file)) return;

    if (pub?.eliminada) {
      alert("No puedes responder una publicación eliminada.");
      return;
    }

    const fd = new FormData();
    fd.append("contenido", replyText);
    fd.append("idCanal", pub!.idCanal);
    if (file) fd.append("file", file);

    try {
      setLoadingReply(true);
      await replyToPublicacion(id, fd);
      setReplyText("");
      setFile(null);
      await fetchData();
    } catch (err) {
      console.error("Error al responder", err);
      alert("No se pudo responder la publicación.");
    } finally {
      setLoadingReply(false);
    }
  };

  if (!pub)
    return (
      <Layout>
        <p className="text-center text-gray-600 mt-8">Cargando publicación...</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <BackButton />

        <PublicationCard publicacion={pub} onRefresh={fetchData} />

        {(pub.comentarios ?? []).length > 0 && (
          <div className="bg-gray-50 p-4 rounded-xl shadow-inner space-y-4">
            <h3 className="font-semibold text-gray-700">
              {(pub.comentarios ?? []).length === 1
                ? "1 respuesta"
                : `${(pub.comentarios ?? []).length} respuestas`}
            </h3>

            {(pub.comentarios ?? []).map((c) => (
              <PublicationCard key={c.id} publicacion={c} depth={1} />
            ))}
          </div>
        )}

        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <h2 className="font-semibold text-lg text-gray-700">Responder</h2>

          {pub.eliminada ? (
            <p className="text-gray-500 italic text-sm">
              No puedes responder porque esta publicación ha sido eliminada.
            </p>
          ) : (
            <form onSubmit={handleReply} className="space-y-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-2 border rounded resize-none"
                rows={3}
                placeholder="Escribe tu respuesta..."
              />

              <label className="text-purple-600 cursor-pointer hover:underline">
                Subir multimedia
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>

              {file && (
                <p className="text-sm text-gray-500 truncate">
                  Archivo: {file.name}
                </p>
              )}

              <button
                disabled={loadingReply}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-60"
              >
                {loadingReply ? "Enviando..." : "Responder"}
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
