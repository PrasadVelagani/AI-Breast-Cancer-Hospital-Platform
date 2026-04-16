import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Stethoscope, LogOut, UserPlus } from "lucide-react";

const ManageDoctors = () => {

  const [doctors, setDoctors] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialization, setSpecialization] = useState("");

  const hospitalId = localStorage.getItem("hospitalId");
  const navigate = useNavigate();

  // 🔥 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate("/login");
  };

  // 🔥 FETCH DOCTORS
  useEffect(() => {
    if (!hospitalId) return;

    const unsub = onSnapshot(
      collection(db, "hospitals", hospitalId, "doctors"),
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDoctors(list);
      }
    );

    return () => unsub();
  }, [hospitalId]);

  // 🔥 ADD DOCTOR
  const handleAddDoctor = async (e) => {
    e.preventDefault();

    await addDoc(
      collection(db, "hospitals", hospitalId, "doctors"),
      {
        name,
        email,
        specialization,
        status: "inactive",
        createdAt: new Date()
      }
    );

    setName("");
    setEmail("");
    setSpecialization("");
  };

  // 🔥 TOGGLE STATUS
  const toggleStatus = async (doctorId, currentStatus) => {

    const newStatus = currentStatus === "active" ? "inactive" : "active";

    await updateDoc(
      doc(db, "hospitals", hospitalId, "doctors", doctorId),
      { status: newStatus }
    );
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
          <Stethoscope className="text-blue-400" size={34} />
          Manage Doctors
        </h1>

        {/* 🔥 UPDATED LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-400/40 text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white transition duration-300 shadow-lg hover:shadow-red-500/40"
        >
          <LogOut size={16} />
          Logout
        </button>

      </div>

      {/* ADD FORM */}
      <form
        onSubmit={handleAddDoctor}
        className="glass-card p-6 rounded-xl mb-10 max-w-xl glow"
      >
        <h2 className="text-xl font-bold mb-4 text-blue-300">
          Add Doctor
        </h2>

        <input
          type="text"
          placeholder="Doctor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input mb-3"
          required
        />

        <input
          type="email"
          placeholder="Doctor Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mb-3"
          required
        />

        <input
          type="text"
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="input mb-4"
          required
        />

        {/* 🔥 UPDATED ADD BUTTON */}
        <button className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/40">
          <UserPlus size={18} />
          Add Doctor
        </button>

      </form>

      {/* LIST */}
      <h2 className="text-2xl font-bold mb-6 text-purple-300">
        Hospital Doctors
      </h2>

      {doctors.length === 0 && (
        <p className="text-gray-500">No doctors found</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {doctors.map(doc => (

          <div
            key={doc.id}
            className="glass-card p-6 flex justify-between items-center glow"
          >

            <div>
              <h3 className="text-xl font-bold text-blue-400">
                Dr. {doc.name}
              </h3>

              <p className="text-gray-300">{doc.email}</p>

              <p className="text-gray-400">
                {doc.specialization}
              </p>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded text-sm ${
                  doc.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-600/30 text-gray-300"
                }`}
              >
                {doc.status}
              </span>
            </div>

            {/* 🔥 TOGGLE BUTTON */}
            <button
              onClick={() => toggleStatus(doc.id, doc.status)}
              className={`px-4 py-2 rounded-xl font-semibold transition shadow-lg ${
                doc.status === "active"
                  ? "bg-red-500 hover:bg-red-600 hover:shadow-red-500/40"
                  : "bg-green-500 hover:bg-green-600 hover:shadow-green-500/40"
              }`}
            >
              {doc.status === "active" ? "Deactivate" : "Activate"}
            </button>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ManageDoctors;