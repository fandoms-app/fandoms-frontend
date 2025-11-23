import { useState } from "react";
import { cambiarRolUsuario } from "../api/usuarioApi";
import useAuth from "../hooks/useAuth";

interface Props {
  userId: string;
  onClose: () => void;
}

export default function ChangeRoleModal({ userId, onClose }: Props) {
  const [rol, setRol] = useState("usuario");
  const [loading, setLoading] = useState(false);

  const { refreshUser } = useAuth();

  const submit = async () => {
    try {
      setLoading(true);

      await cambiarRolUsuario(userId, rol);

      await refreshUser();

      alert("Rol actualizado");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error actualizando rol");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center">
      <div className="bg-white p-5 rounded shadow w-80 space-y-3">
        <h2 className="text-lg font-bold">Cambiar rol</h2>

        <select
          className="w-full border p-2 rounded"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          <option value="usuario">Usuario</option>
          <option value="moderador">Moderador</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            className="px-3 py-1 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="px-3 py-1 bg-purple-600 text-white rounded"
            disabled={loading}
            onClick={submit}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
