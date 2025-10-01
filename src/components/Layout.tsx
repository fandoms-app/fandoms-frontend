import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export default function Layout({ children, showNavbar = true }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {showNavbar && (
        <nav className="flex justify-between items-center bg-white shadow px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/explore"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Explorar canales
            </Link>
            <Link
              to="/following"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Canales seguidos
            </Link>
          </div>

          <SearchBar />

          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu user={user} logout={logout} navigate={navigate} />
            ) : (
              <Link
                to="/login"
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </nav>
      )}

      <main className="flex-grow p-6 flex justify-center">
        <div className="w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
