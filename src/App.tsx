import { type JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RequireRole from "./Routes/RequireRole";
import GestionSolicitudesPage from "./pages/Channel/GestionSolicitudesPage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProtectedRoute from "./Routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import EditProfile from "./pages/User/EditProfile";
import UserProfile from "./pages/User/UserProfile";
import ExploreChannels from "./pages/Channel/ExploreChannels";
import ChannelDetail from "./pages/Channel/ChannelDetail";
import CreateChannel from "./pages/Channel/CreateChannel";
import FollowingChannels from "./pages/Channel/FollowingChannels";
import PublicationDetail from "./pages/Publication/PublicationDetail";
import EditPublication from "./pages/Publication/EditPublication";
import EditChannel from "./pages/Channel/EditChannel";
import ReportesPage from "./pages/Reports/ReportesPage";

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/usuarios/:id"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <ExploreChannels />
          </ProtectedRoute>
        }
      />

      <Route
        path="/canales/:id"
        element={
          <ProtectedRoute>
            <ChannelDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-channel"
        element={
          <ProtectedRoute>
            <CreateChannel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-channel/:parentId"
        element={
          <ProtectedRoute>
            <CreateChannel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/following"
        element={
          <ProtectedRoute>
            <FollowingChannels />
          </ProtectedRoute>
        }
      />

      <Route
        path="/publicaciones/:id"
        element={
          <ProtectedRoute>
            <PublicationDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-publication/:id"
        element={
          <ProtectedRoute>
            <EditPublication />
          </ProtectedRoute>
        }
      />

      <Route
        path="/canales/:id/editar"
        element={
          <ProtectedRoute>
            <EditChannel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reportes"
        element={
          <ProtectedRoute>
            <RequireRole allowed={["moderador", "admin"]}>
              <ReportesPage />
            </RequireRole>
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestionar-solicitudes"
        element={
          <ProtectedRoute>
            <RequireRole allowed={["moderador", "admin"]}>
              <GestionSolicitudesPage />
            </RequireRole>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
