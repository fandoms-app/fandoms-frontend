import useAuth from "../hooks/useAuth";
import DashboardUser from "./DashboardUser";
import StaffDashboard from "./DashboardStaff";
import Layout from "../components/Layout";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const rol = user.rol?.toLowerCase() ?? "usuario";

  return (
    <Layout>
      {rol === "admin" || rol === "moderador"
        ? <StaffDashboard />
        : <DashboardUser />}
    </Layout>
  );
}
