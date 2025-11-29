import { useState } from "react";
import { createPublicacion } from "../../api/publicacionApi";

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
      className="bg-white p-3 rounded-lg shadow space-y-3"
    >
      <h2 className="font-semibold text-md text-purple-700">
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
        className="w-full border rounded p-2 resize-none text-sm"
        rows={2}
      />

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-purple-600 cursor-pointer hover:underline text-sm">
          Subir imagen o video
          <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
        </label>

        {previewUrl && (
          <div className="flex justify-center mt-1">
            {file?.type.startsWith("video") ? (
              <video src={previewUrl} controls className="max-h-40 rounded-md" />
            ) : (
              <img src={previewUrl} className="max-h-40 rounded-md object-cover" />
            )}
          </div>
        )}
      </div>

      <button
        disabled={loading}
        className="bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700 transition text-sm disabled:opacity-60"
      >
        {loading ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
}
