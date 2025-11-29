import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCanal, updateCanal } from "../../api/canalApi";
import Layout from "../../components/Layout/Layout";
import BackButton from "../../components/Common/BackButton";
import Card from "../../components/Card/Card";
import type { Canal } from "../../types/canal";

export default function EditChannel() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [nombreCanal, setNombreCanal] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    getCanal(id)
      .then((res) => {
        const canal: Canal = res.data;
        setNombreCanal(canal.nombreCanal);
        setDescripcion(canal.descripcion ?? "");
      })
      .catch((err) => {
        console.error("Error cargando canal", err);
        alert("No se pudo cargar el canal.");
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setLoading(true);

      await updateCanal(id, {
        nombreCanal,
        descripcion,
      });

      alert("Canal actualizado con éxito.");
      navigate(`/canales/${id}`);
    } catch (err) {
      console.error("Error al actualizar el canal", err);
      alert("No se pudo actualizar el canal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-md space-y-4">
        <BackButton />

        <Card className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-purple-600">Editar canal</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={nombreCanal}
              onChange={(e) => setNombreCanal(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
