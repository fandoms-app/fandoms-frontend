import { type JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import UserProfile from "./pages/UserProfile";
import ExploreChannels from "./pages/ExploreChanels";
import ChannelDetail from "./pages/ChannelDetail";
import CreateChannel from "./pages/CreateChannel";
import FollowingChannels from "./pages/FollowingChannels";
import PublicationDetail from "./pages/PublicationDetail";
import EditPublication from "./pages/EditPublication";
import ProtectedRoute from "./components/ProtectedRoute";

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

    </Routes>
  );
}
