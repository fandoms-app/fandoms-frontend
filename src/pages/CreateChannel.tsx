import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import { createCanal } from "../api/canalApi";
import BackButton from "../components/BackButton";

export default function CreateChannel() {
  const navigate = useNavigate();
  const { parentId } = useParams<{ parentId: string }>();
  const [nombreCanal, setNombreCanal] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createCanal({
        nombreCanal,
        descripcion,
        idCanalPadre: parentId ?? null,
      });
      navigate(`/channels/${res.data.id}`);
    } catch (err) {
      console.error("Error creando canal", err);
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-md space-y-4">
        <BackButton />
        <Card className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-purple-600">
            {parentId ? "Crear subcanal" : "Crear canal"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre del canal"
              value={nombreCanal}
              onChange={(e) => setNombreCanal(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            >
              Crear
            </button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
