import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const ProtectedRoute = ({ children, role }) => {

  const user = auth.currentUser;
  const savedRole = localStorage.getItem("userRole");
  const hospitalId = localStorage.getItem("hospitalId");

  // 🔴 Not logged in
  if (!user && !savedRole) {
    return <Navigate to="/login" />;
  }

  // 🟡 Role not selected
  if (!savedRole) {
    return <Navigate to="/role-select" />;
  }

  // 🔴 Role mismatch
  if (role && role !== savedRole) {
    return <Navigate to="/role-select" />;
  }

  // 🔴 Hospital missing (extra safety)
  if (!hospitalId) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;