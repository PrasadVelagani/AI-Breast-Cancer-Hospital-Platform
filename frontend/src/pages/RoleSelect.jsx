import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const RoleSelect = () => {
  const navigate = useNavigate();

  const chooseRole = async (role) => {

    localStorage.setItem("userRole", role);

    try {
      const q = query(
        collection(db, "hospitals"),
        where("email", "==", auth.currentUser.email)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const hospitalData = snapshot.docs[0].data();
        localStorage.setItem("hospitalName", hospitalData.hospitalName);
      }

    } catch (err) {
      console.log(err);
    }

    if (role === "admin") {
      navigate("/admin-dashboard");
      return;
    }

    navigate("/doctor-login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-gray-900 to-black text-white">

      <div className="glass-card p-10 w-full max-w-md text-center glow">

        {/* HEADER */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Select Your Role
        </h1>

        <p className="text-gray-400 mt-2 mb-8">
          Choose how you want to access the platform
        </p>

        {/* BUTTONS */}
        <div className="flex gap-4">

          {/* ADMIN */}
          <button
            onClick={() => chooseRole("admin")}
            className="flex-1 p-5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 transition"
          >
            <div className="text-2xl mb-2">🏥</div>
            <p className="font-semibold">Admin / Hospital</p>
          </button>

          {/* DOCTOR */}
          <button
            onClick={() => chooseRole("doctor")}
            className="flex-1 p-5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 hover:scale-105 transition"
          >
            <div className="text-2xl mb-2">👨‍⚕️</div>
            <p className="font-semibold">Doctor</p>
          </button>

        </div>

      </div>
    </div>
  );
};

export default RoleSelect;