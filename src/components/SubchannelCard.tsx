import { Link } from "react-router-dom";
import type { Canal } from "../types";

interface Props {
  canal: Canal;
}

export default function SubchannelCard({ canal }: Props) {
  return (
    <Link
      to={`/channels/${canal.id}`}
      className="min-w-[140px] bg-purple-50 p-3 rounded-xl shadow hover:shadow-md transition flex-shrink-0"
    >
      <h3 className="font-semibold text-purple-700 truncate">
        {canal.nombreCanal}
      </h3>
      {canal.descripcion && (
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
          {canal.descripcion}
        </p>
      )}
    </Link>
  );
}
