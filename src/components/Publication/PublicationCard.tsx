import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { deletePublicacion } from "../../api/publicacionApi";
import { formatearFechaHora } from "../../utils/formatDate";
import ActionMenu from "../Layout/ActionMenu";
import type { Publicacion } from "../../types/publicacion";

interface Props {
  publicacion: Publicacion;
  onRefresh?: () => Promise<void>;
  depth?: number;
}

export default function PublicationCard({ publicacion, onRefresh, depth = 0 }: Props) {
  const [openMedia, setOpenMedia] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const esPropietario = user?.id === publicacion.idUsuario;
  const eliminada = publicacion.eliminada === true;

  const handleOpenDetail = () => navigate(`/publicaciones/${publicacion.id}`);

  if (eliminada) {
    return (
      <div
        onClick={handleOpenDetail}
        className={`p-4 rounded-xl bg-gray-100 text-gray-500 italic border border-gray-300 
          cursor-pointer hover:bg-gray-200 transition ${depth > 0 ? "ml-8 border-l-2 border-purple-200" : ""
          }`}
      >
        Esta publicación ya no está disponible.
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deletePublicacion(publicacion.id);
      await onRefresh?.();
    } catch (err) {
      console.error("No se pudo eliminar publicacion", err);
      alert("No se pudo eliminar la publicación.");
    }
  };

  const isVideo = publicacion.mediaUrl?.endsWith(".mp4");
  const mediaSrc = publicacion.mediaUrl ?? undefined;

  return (
    <div
      onClick={handleOpenDetail}
      className={`bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow space-y-3 cursor-pointer ${depth > 0 ? "ml-8 border-l-2 border-purple-200" : ""
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {publicacion.avatarUsuario ? (
            <img
              src={publicacion.avatarUsuario}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/usuarios/${publicacion.idUsuario}`);
              }}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center text-white cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/usuarios/${publicacion.idUsuario}`);
              }}
            >
              {publicacion.nombreUsuario?.charAt(0).toUpperCase() ?? "?"}
            </div>
          )}

          <div>
            <p
              className="font-semibold text-gray-800 hover:underline cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/usuarios/${publicacion.idUsuario}`);
              }}
            >
              {publicacion.nombreUsuario ?? "Usuario desconocido"}
            </p>
            <p className="text-xs text-gray-500">
              {formatearFechaHora(publicacion.fechaCreacion)}
            </p>
          </div>
        </div>

        {user && (
          <div onClick={(e) => e.stopPropagation()}>
            <ActionMenu
              tipo="publicacion"
              idObjetivo={publicacion.id}
              esPropietario={esPropietario}
              onEdit={() => navigate(`/edit-publication/${publicacion.id}`)}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>

      {publicacion.titulo && (
        <h3 className="font-semibold text-lg text-purple-700">
          {publicacion.titulo}
        </h3>
      )}
      <p className="text-gray-700 whitespace-pre-line">{publicacion.contenido}</p>

      {mediaSrc && (
        <div
          className="flex justify-center"
          onClick={(e) => {
            e.stopPropagation();
            setOpenMedia(true);
          }}
        >
          {isVideo ? (
            <video src={mediaSrc} controls className="rounded-lg max-h-80 object-cover" />
          ) : (
            <img src={mediaSrc} alt="Multimedia" className="rounded-lg max-h-80 object-cover" />
          )}
        </div>
      )}

      {(publicacion.comentariosCount ?? 0) > 0 && (
        <p className="text-xs text-gray-500">
          {publicacion.comentariosCount}{" "}
          {publicacion.comentariosCount === 1 ? "respuesta" : "respuestas"}
        </p>
      )}

      <div className="flex gap-4 mt-2 text-sm" onClick={(e) => e.stopPropagation()}>
        <button
          className="flex items-center gap-1 text-gray-600 hover:underline"
          onClick={() => navigate(`/publicaciones/${publicacion.id}`)}
        >
          Responder
        </button>
      </div>

      {openMedia && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setOpenMedia(false)}
        >
          <div
            className="relative max-w-3xl w-full flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo ? (
              <video src={mediaSrc} controls autoPlay className="max-h-[90vh] rounded" />
            ) : (
              <img src={mediaSrc} alt="preview" className="max-h-[90vh] rounded" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
