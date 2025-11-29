import { useState } from "react";
import api from "../../api/api";

interface Props {
  currentAvatar: string | null;
  onUploadSuccess: (newAvatarUrl: string) => void;
}

export function ProfileAvatarUploader({ currentAvatar, onUploadSuccess }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await api.patch("/usuarios/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploadSuccess(res.data.avatar);
    } catch (err) {
      console.error("Error al subir el avatar:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <img
        src={currentAvatar ?? "/default-avatar.png"}
        alt="Avatar actual"
        className="w-24 h-24 rounded-full object-cover mb-2 border"
      />
      <label className="cursor-pointer bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
        {uploading ? "Subiendo..." : "Cambiar avatar"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
