import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PatientLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "patient@gmail.com" && password === "patient123") {
      login({ role: "patient", token: "dummy-token" });
      navigate("/patient");
    } else {
      alert("Invalid Patient Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow w-[380px]">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Patient Login
        </h2>

        <input
          type="email"
          placeholder="Patient Email"
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
};

export default PatientLogin;
