import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  addDoc,
  onSnapshot
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Users, LogOut, UserPlus } from "lucide-react";

const ManagePatients = () => {

  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const hospitalId = localStorage.getItem("hospitalId");
  const navigate = useNavigate();

  // 🔥 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate("/login");
  };

  // 🔹 FETCH
  useEffect(() => {
    if (!hospitalId) return;

    const unsub = onSnapshot(
      collection(db, "hospitals", hospitalId, "patients"),
      (snapshot) => {
        setPatients(snapshot.docs.map(doc => doc.data()));
      }
    );

    return () => unsub();
  }, [hospitalId]);

  // 🔹 ADD
  const addPatient = async (e) => {
    e.preventDefault();

    await addDoc(
      collection(db, "hospitals", hospitalId, "patients"),
      {
        name,
        age,
        gender,
        createdAt: new Date()
      }
    );

    setName("");
    setAge("");
    setGender("");
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <Users className="text-blue-400" size={34} />
            Manage Patients
          </h1>

          <p className="text-gray-400 mt-1">
            Register patients and maintain hospital records
          </p>
        </div>

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
      <div className="glass-card p-6 rounded-xl mb-10 max-w-3xl glow">

        <h3 className="text-xl font-semibold mb-4 text-blue-300">
          Add New Patient
        </h3>

        <form onSubmit={addPatient} className="grid md:grid-cols-2 gap-4">

          <input
            className="input"
            placeholder="Patient Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="input"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />

          {/* GENDER */}
          <div className="md:col-span-2">
            <label className="text-gray-300 mr-6">Gender:</label>

            <label className="mr-6">
              <input
                type="radio"
                value="male"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
                className="mr-2"
                required
              />
              Male
            </label>

            <label className="mr-6">
              <input
                type="radio"
                value="female"
                checked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
                className="mr-2"
              />
              Female
            </label>

            <label>
              <input
                type="radio"
                value="others"
                checked={gender === "others"}
                onChange={(e) => setGender(e.target.value)}
                className="mr-2"
              />
              Others
            </label>
          </div>

          {/* 🔥 UPDATED ADD BUTTON */}
          <button className="md:col-span-2 mt-2 w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/40">
            <UserPlus size={18} />
            Add Patient
          </button>

        </form>

      </div>

      {/* LIST */}
      <h2 className="text-2xl font-bold mb-6 text-purple-300">
        Registered Patients
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {patients.map((p, i) => (

          <div
            key={i}
            className="glass-card p-5 flex justify-between items-center glow"
          >

            <div>
              <p className="font-semibold text-lg text-blue-400">
                {p.name}
              </p>

              <p className="text-gray-400">
                {p.age} yrs • {p.gender}
              </p>
            </div>

            <span className="bg-blue-500/20 text-blue-300 px-4 py-1 rounded-full text-sm">
              Patient
            </span>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ManagePatients;