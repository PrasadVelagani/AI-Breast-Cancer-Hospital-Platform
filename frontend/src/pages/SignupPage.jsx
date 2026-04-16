import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const SignupPage = () => {
  const navigate = useNavigate();

  const [hospitalName, setHospitalName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "hospitals", userCred.user.uid), {
        hospitalName,
        email,
        phone,
        city,
        district,
        state,
        pincode,
        createdAt: new Date()
      });

      alert("Hospital Registered Successfully!");
      navigate("/login");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-gray-900 to-black text-white">

      <div className="glass-card p-10 w-full max-w-lg glow">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Register Your Hospital
        </h1>

        <p className="text-center text-gray-400 mt-2 mb-6">
          Create your secure hospital account
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            className="input"
            placeholder="Hospital Name"
            value={hospitalName}
            onChange={(e)=>setHospitalName(e.target.value)}
            required
          />

          <input
            type="email"
            className="input"
            placeholder="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            className="input"
            placeholder="Phone Number"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="City"
              value={city}
              onChange={(e)=>setCity(e.target.value)}
              required
            />

            <input
              className="input"
              placeholder="District"
              value={district}
              onChange={(e)=>setDistrict(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="State"
              value={state}
              onChange={(e)=>setState(e.target.value)}
              required
            />

            <input
              className="input"
              placeholder="Pincode"
              value={pincode}
              onChange={(e)=>setPincode(e.target.value)}
              required
            />
          </div>

          <input
            type="password"
            className="input"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button
  type="submit"
  className="w-full py-4 mt-4 rounded-xl font-semibold text-lg 
  bg-gradient-to-r from-blue-500 to-blue-700 
  hover:from-blue-600 hover:to-blue-800 
  transition transform hover:scale-[1.02] shadow-lg"
>
  Register Hospital
</button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-gray-400 mt-6">
          Already registered?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default SignupPage;