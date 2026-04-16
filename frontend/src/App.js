import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔐 Auth
import { AuthProvider } from "./context/AuthContext";

// 🌐 Pages
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import RoleSelect from "./pages/RoleSelect";
import DoctorProfileSetup from "./pages/DoctorProfileSetup";

// 🔥 LOGIN (IMPORTANT FIX)
import DoctorLogin from "./auth/DoctorLogin";

// 🏥 Dashboards
import HospitalDashboard from "./dashboards/hospital/HospitalDashboard";
import DoctorDashboard from "./dashboards/doctor/DoctorDashboard";

// 🔐 Guards
import ProtectedRoute from "./components/ProtectedRoute";

// 🧑‍⚕️ Admin Pages
import ManageDoctors from "./dashboards/hospital/ManageDoctors";
import ManagePatients from "./dashboards/hospital/ManagePatients";
import Appointments from "./dashboards/hospital/Appointments";
import AIAnalyses from "./dashboards/hospital/AIAnalyses";
import ReportHistory from "./dashboards/hospital/ReportHistory";
import ExplainabilityAudit from "./dashboards/hospital/ExplainabilityAudit";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* 🌍 Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 👤 Role */}
          <Route path="/role-select" element={<RoleSelect />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/doctor-setup" element={<DoctorProfileSetup />} />

          {/* 🏥 Admin */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin">
                <HospitalDashboard />
              </ProtectedRoute>
            }
          />

          {/* 👨‍⚕️ Doctor */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute role="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Pages */}
          <Route path="/hospital/doctors" element={<ManageDoctors />} />
          <Route path="/hospital/patients" element={<ManagePatients />} />
          <Route path="/hospital/appointments" element={<Appointments />} />
          <Route path="/hospital/analyze" element={<AIAnalyses />} />
          <Route path="/hospital/reports" element={<ReportHistory />} />
          <Route path="/hospital/audit" element={<ExplainabilityAudit />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;