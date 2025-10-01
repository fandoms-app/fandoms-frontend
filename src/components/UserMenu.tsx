import { useState, useRef, useEffect } from "react";

interface UserMenuProps {
  user: { id: string; nombreUsuario: string; avatar?: string | null };
  logout: () => void;
  navigate: (path: string) => void;
}

export default function UserMenu({ user, logout, navigate }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setOpen(!open)}>
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.nombreUsuario}
            className="w-10 h-10 rounded-full object-cover border-2 border-purple-600"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold">
            {user.nombreUsuario.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
          <button
            onClick={() => {
              setOpen(false);
              navigate(`/users/${user.id}`);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Mi perfil
          </button>
          <button
            onClick={() => {
              setOpen(false);
              navigate("/edit-profile");
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Editar perfil
          </button>
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
