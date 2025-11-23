import { useState } from "react";
import { crearReporte } from "../api/reporteApi";

interface Props {
  tipo: "usuario" | "publicacion" | "canal";
  idObjetivo: string;
  onClose: () => void;
}

export default function ReportForm({ tipo, idObjetivo, onClose }: Props) {
  const [motivo, setMotivo] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await crearReporte({ tipo, idObjetivo, motivo });

    alert("Reporte enviado");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center z-[999]">
      <form
        onSubmit={submit}
        className="bg-white p-5 rounded-md w-96 space-y-3 shadow-lg"
      >
        <h2 className="text-xl font-bold">Enviar reporte</h2>

        <textarea
          className="w-full p-2 border rounded"
          placeholder="Describe el problema..."
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          required
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            type="button"
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
