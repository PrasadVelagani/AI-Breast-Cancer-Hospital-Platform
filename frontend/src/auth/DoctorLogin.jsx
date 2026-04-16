import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

const DoctorLogin = () => {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const hospitalId = localStorage.getItem("hospitalId");

      if (!hospitalId) {
        alert("Hospital ID missing ❌");
        return;
      }

      const q = query(
        collection(db, "hospitals", hospitalId, "doctors"),
        where("email", "==", email)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("Doctor not found ❌");
        return;
      }

      const doctorDoc = snapshot.docs[0];

      await updateDoc(
        doc(db, "hospitals", hospitalId, "doctors", doctorDoc.id),
        { status: "active" }
      );

      localStorage.setItem("userRole", "doctor");
      localStorage.setItem("doctorEmail", email);

      login({
        role: "doctor",
        email
      });

      navigate("/doctor-dashboard");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-gray-900 to-black text-white">

      <form
        onSubmit={handleLogin}
        className="glass-card p-10 w-full max-w-md glow"
      >

        {/* HEADER */}
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Doctor Login
        </h2>

        <p className="text-center text-gray-400 mb-6">
          Secure access for doctors
        </p>

        {/* INPUT */}
        <input
          type="email"
          placeholder="Doctor Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mb-4"
          required
        />

        {/* BUTTON */}
        <button className="primary-btn full">
  Login
</button>

      </form>

    </div>
  );
};

export default DoctorLogin;