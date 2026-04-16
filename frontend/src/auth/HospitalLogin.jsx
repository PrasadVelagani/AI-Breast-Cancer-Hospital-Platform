import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const handleLogin = (e) => {
  e.preventDefault();

  if (email === "admin@hospital.com" && password === "admin123") {

    // 🔥 DYNAMIC hospitalId
    localStorage.setItem("hospitalId", email);
    localStorage.setItem("hospitalName", "Demo Hospital");

    login({ role: "hospital", token: "dummy-token" });

    navigate("/role-select");

  } else {
    alert("Invalid Hospital Credentials");
  }
};

 return (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
    <form
      onSubmit={handleLogin}
      className="bg-white shadow-xl rounded-xl p-10 w-[420px]"
    >
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Hospital Login
      </h2>

      <input
        type="email"
        placeholder="Hospital Email"
        className="input"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="input"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mt-2"
      >
        Login
      </button>

      <p className="text-xs text-red-600 mt-5 text-center">
        This system is a medical decision support tool.
        Final diagnosis must be made by certified doctors.
      </p>
    </form>
  </div>
);

export default HospitalLogin;
