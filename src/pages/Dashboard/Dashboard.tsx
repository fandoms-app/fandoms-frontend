import Layout from "../../components/Layout/Layout";
import useAuth from "../../hooks/useAuth";
import StaffDashboard from "./DashboardStaff";
import DashboardUser from "./DashboardUser";

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
