import React, { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const DoctorProfileSetup = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [status, setStatus] = useState("active"); // ⭐ NEW

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await setDoc(doc(db, "doctors", user.uid), {
        uid: user.uid,
        name,
        email: user.email,
        specialization,
        status,                // ⭐ SAVE STATUS
        createdAt: new Date()
      });

      alert("Profile saved");
      navigate("/doctor-dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Doctor Profile Setup</h1>
        <p>Complete your professional details</p>

        <form onSubmit={handleSubmit} className="auth-form">

          <input
            placeholder="Doctor Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />

          <input
            placeholder="Specialization (Oncology, Radiology...)"
            value={specialization}
            onChange={(e)=>setSpecialization(e.target.value)}
            required
          />

          {/* ⭐ STATUS TOGGLE */}
          <label style={{marginTop:"10px"}}>Availability</label>
          <select
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
          >
            <option value="active">Active (Available)</option>
            <option value="inactive">Inactive (On Leave)</option>
          </select>

          <button className="primary-btn">Save Profile</button>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfileSetup;
