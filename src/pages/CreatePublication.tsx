import { useState } from "react";
import { createPublicacion } from "../api/publicacionApi";

interface Props {
  idCanal: string;
  onCreated?: () => void;
}

export default function CreatePublication({ idCanal, onCreated }: Props) {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contenido.trim() && !file) return;

    const fd = new FormData();
    if (titulo.trim()) fd.append("titulo", titulo);
    fd.append("contenido", contenido);
    fd.append("idCanal", idCanal);
    if (file) fd.append("file", file);

    try {
      setLoading(true);
      await createPublicacion(fd);
      setTitulo("");
      setContenido("");
      setFile(null);
      setPreviewUrl(null);
      onCreated?.();
    } catch (err) {
      console.error("Error al crear publicación", err);
      alert("No se pudo crear la publicación.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl shadow space-y-4"
    >
      <h2 className="font-semibold text-lg text-purple-700">
        Crear publicación
      </h2>

      <input
        type="text"
        placeholder="Título (opcional)"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="w-full border rounded p-2 text-sm"
      />

      <textarea
        placeholder="¿Qué estás pensando?"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        className="w-full border rounded p-2 resize-none"
        rows={3}
      />

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-purple-600 cursor-pointer hover:underline">
          <span className="text-sm">Subir imagen o video</span>
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {previewUrl && (
          <div className="flex justify-center mt-2">
            {file?.type.startsWith("video") ? (
              <video
                src={previewUrl}
                controls
                className="max-h-60 rounded-lg"
              />
            ) : (
              <img
                src={previewUrl}
                alt="preview"
                className="max-h-60 rounded-lg object-cover"
              />
            )}
          </div>
        )}
      </div>

      <button
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-60"
      >
        {loading ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
}
