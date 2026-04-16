import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleGuard = ({ children, role }) => {
  const { user } = useAuth();

  console.log("RoleGuard user:", user); // 🔥 debug

  if (!user) {
    return <Navigate to="/role-select" />;
  }

  if (user.role !== role) {
    return <Navigate to="/role-select" />;
  }

  return children;
};

export default RoleGuard;