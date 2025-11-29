import { useState, useEffect } from "react";
import { crearSolicitudCanal } from "../../api/solicitudCanalApi";
import { getCanal } from "../../api/canalApi";

interface Props {
  parentId?: string | null;
  onClose: () => void;
}

export default function CreateSolicitudCanalModal({ parentId, onClose }: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nombrePadre, setNombrePadre] = useState<string | null>(null);

  useEffect(() => {
    if (!parentId) return;
    getCanal(parentId)
      .then((res) => setNombrePadre(res.data.nombreCanal))
      .catch(() => setNombrePadre(null));
  }, [parentId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await crearSolicitudCanal({
        nombre,
        descripcion,
        idCanalPadre: parentId ?? null
      });

      alert("Solicitud enviada con éxito.");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al enviar solicitud.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center z-[999]">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-xl"
      >
        <h2 className="text-xl font-bold text-purple-700">
          {parentId ? "Solicitar subcanal" : "Solicitar canal"}
        </h2>

        <input
          type="text"
          placeholder="Nombre del canal"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full border rounded p-2"
        />

        <textarea
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border rounded p-2"
        />

        {parentId && (
          <p className="text-sm text-gray-600">
            Subcanal dentro de:{" "}
            <b>{nombrePadre ?? "Cargando..."}</b>
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-3 py-1 bg-purple-600 text-white rounded"
          >
            Enviar solicitud
          </button>
        </div>
      </form>
    </div>
  );
}
