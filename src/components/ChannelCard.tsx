import { Link } from "react-router-dom";
import Card from "./Card";
import type { Canal } from "../types";

interface Props {
  canal: Canal;
  showDescription?: boolean;
  showFollowButton?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  isFollowing?: boolean;
}

export default function ChannelCard({
  canal,
  showDescription = true,
  showFollowButton = false,
  onFollow,
  onUnfollow,
  isFollowing,
}: Props) {
  return (
    <Card className="p-4 space-y-2 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg text-purple-700">
          <Link to={`/channels/${canal.id}`} className="hover:underline">
            {canal.nombreCanal}
          </Link>
        </h2>

        {showFollowButton && (
          <button
            onClick={isFollowing ? onUnfollow : onFollow}
            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition"
          >
            {isFollowing ? "Dejar de seguir" : "Seguir"}
          </button>
        )}
      </div>

      {showDescription && (
        <p className="text-gray-600">
          {canal.descripcion || "Sin descripción"}
        </p>
      )}

      <p className="text-sm text-gray-500">
        {canal.followersCount} {canal.followersCount === 1 ? "seguidor" : "seguidores"}
      </p>

    </Card>
  );
}
