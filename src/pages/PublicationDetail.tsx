import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import PublicationCard from "../components/PublicationCard";
import { getPublicacionById, replyToPublicacion } from "../api/publicacionApi";
import type { Publicacion } from "../types";

export default function PublicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pub?.idUsuario) navigate(`/usuarios/${pub.idUsuario}`);
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

        <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            {pub.avatarUsuario ? (
              <img
                src={pub.avatarUsuario}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
                onClick={goToProfile}
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center text-white cursor-pointer hover:opacity-80 transition"
                onClick={goToProfile}
              >
                {pub.nombreUsuario?.charAt(0).toUpperCase() ?? "?"}
              </div>
            )}

            <div>
              <p
                className="font-semibold text-gray-800 hover:underline cursor-pointer"
                onClick={goToProfile}
              >
                {pub.nombreUsuario ?? "Usuario desconocido"}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(pub.fechaCreacion).toLocaleString("es-AR")}
              </p>
            </div>
          </div>
        </div>

        <PublicationCard publicacion={pub} onRefresh={fetchData} />

        {pub.comentarios && pub.comentarios.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-xl shadow-inner space-y-4">
            <h3 className="font-semibold text-gray-700">
              {pub.comentarios.length === 1
                ? "1 respuesta"
                : `${pub.comentarios.length} respuestas`}
            </h3>

            {pub.comentarios.map((c) => (
              <PublicationCard key={c.id} publicacion={c} />
            ))}
          </div>
        )}

        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <h2 className="font-semibold text-lg text-gray-700">Responder</h2>

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
        </div>
      </div>
    </Layout>
  );
}
