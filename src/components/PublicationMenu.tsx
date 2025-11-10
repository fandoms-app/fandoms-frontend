import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePublicacion } from "../api/publicacionApi";
import { useAuth } from "../hooks/useAuth";
import type { Publicacion } from "../types";

interface Props {
  publicacion: Publicacion;
  onRefresh?: () => Promise<void>;
}

export default function PublicationMenu({ publicacion, onRefresh }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const canEdit = user?.id === publicacion.idUsuario;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("¿Seguro que deseas eliminar esta publicación?")) return;

    try {
      await deletePublicacion(publicacion.id);
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error("Error al eliminar la publicación", err);
      alert("No se pudo eliminar la publicación.");
    } finally {
      setOpen(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-publication/${publicacion.id}`);
    setOpen(false);
  };

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleToggleMenu}
        className="p-2 text-gray-600 hover:text-purple-600"
        aria-label="Opciones de publicación"
      >
        ⋮
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50"
        >
          {canEdit ? (
            <>
              <button
                onClick={handleEdit}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Editar publicación
              </button>
              <button
                onClick={handleDelete}
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
              >
                Eliminar publicación
              </button>
            </>
          ) : (
            <p className="px-4 py-2 text-sm text-gray-500">
              Sin permisos de edición
            </p>
          )}
        </div>
      )}
    </div>
  );
}
