import { useNavigate } from "react-router-dom";

export default function BackButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1 border rounded-md text-purple-600 hover:bg-purple-100 hover:border-purple-700 transition"
        >
            <span className="text-lg">←</span>
            <span className="text-sm font-medium">Volver</span>
        </button>
    );
}
