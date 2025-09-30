import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./hooks/useAuth";
import type { JSX } from "react";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import UserProfile from "./pages/UserProfile";
import ExploreChannels from "./pages/ExploreChanels";
import ChannelDetail from "./pages/ChannelDetail";
import CreateChannel from "./pages/CreateChannel";
import FollowingChannels from "./pages/FollowingChannels";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { accessToken } = useAuth();
  return accessToken ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <PrivateRoute>
              <ExploreChannels />
            </PrivateRoute>
          }
        />
        <Route
          path="/channels/:id"
          element={
            <PrivateRoute>
              <ChannelDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-channel"
          element={
            <PrivateRoute>
              <CreateChannel />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-channel/:parentId"
          element={
            <PrivateRoute>
              <CreateChannel />
            </PrivateRoute>
          }
        />
        <Route
          path="/following"
          element={
            <PrivateRoute>
              <FollowingChannels />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
