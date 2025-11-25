import { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import ChangeRoleModal from "./ChangeRoleModal";
import ReportForm from "../pages/ReportForm";
import { esStaff, esAdmin, getRol } from "../utils/roles";

type Tipo = "usuario" | "canal" | "publicacion";

interface Props {
  tipo: Tipo;
  idObjetivo: string;
  rolObjetivo?: string | null;
  esPropietario?: boolean;
  onEdit?: () => void;
  onDelete?: () => void | Promise<void>;
  className?: string;
}

export default function ActionMenu({
  tipo,
  idObjetivo,
  rolObjetivo,
  esPropietario = false,
  onEdit,
  onDelete,
  className = "",
}: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user) return null;

  const rol = getRol(user.rol);
  const staff = esStaff(rol);
  const admin = esAdmin(rol);
  const esMismoUsuario = tipo === "usuario" && user.id === idObjetivo;

  const objetivoEsAdmin = rolObjetivo?.toLowerCase() === "admin";

  const puedeEditar =
    tipo === "usuario"
      ? esPropietario
      : tipo === "canal"
      ? staff
      : tipo === "publicacion"
      ? esPropietario
      : false;

  const puedeBorrar =
    tipo === "usuario"
      ? admin && !esMismoUsuario
      : tipo === "canal"
      ? staff
      : tipo === "publicacion"
      ? esPropietario || staff
      : false;

  const puedeCambiarRol =
    tipo === "usuario" &&
    staff &&
    !esMismoUsuario &&
    (!objetivoEsAdmin || admin); 

  const puedeReportar =
    (tipo === "usuario" || tipo === "publicacion" || tipo === "canal") &&
    !esPropietario &&
    !esMismoUsuario;

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((s) => !s);
        }}
        className="p-1 rounded hover:bg-gray-200"
        aria-label="Abrir menú"
      >
        ⋮
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {puedeEditar && (
            <button
              className="w-full px-3 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                setOpen(false);
                onEdit?.();
              }}
            >
              Editar
            </button>
          )}

          {puedeBorrar && (
            <button
              className="w-full px-3 py-2 text-left hover:bg-gray-100 text-red-600"
              onClick={() => {
                setOpen(false);
                if (confirm("¿Estás seguro?")) {
                  void Promise.resolve(onDelete?.());
                }
              }}
            >
              Eliminar
            </button>
          )}

          {puedeCambiarRol && (
            <button
              className="w-full px-3 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                setOpen(false);
                setOpenRoleModal(true);
              }}
            >
              Cambiar rol
            </button>
          )}

          {puedeReportar && (
            <button
              className="w-full px-3 py-2 text-left hover:bg-gray-100 text-red-600"
              onClick={() => {
                setOpen(false);
                setOpenReportModal(true);
              }}
            >
              Reportar
            </button>
          )}
        </div>
      )}

      {openRoleModal && (
        <ChangeRoleModal
          userId={idObjetivo}
          onClose={() => setOpenRoleModal(false)}
        />
      )}

      {openReportModal && (
        <ReportForm
          tipo={tipo}
          idObjetivo={idObjetivo}
          onClose={() => setOpenReportModal(false)}
        />
      )}
    </div>
  );
}
