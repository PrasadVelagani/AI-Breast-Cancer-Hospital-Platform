import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // ✅ store hospital info
      localStorage.setItem("hospitalId", user.uid);
      localStorage.setItem("hospitalEmail", user.email);

      alert("Login Successful ✅");

      navigate("/role-select");

    } catch (err) {
      console.log(err);
      alert("Login Failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-gray-900 to-black text-white">

      <div className="glass-card p-10 w-full max-w-md glow">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Hospital Portal Login
        </h1>

        <p className="text-center text-gray-400 mt-2 mb-6">
          Secure access for hospitals & doctors
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
<button className="primary-btn full">
  Login
</button>

        </form>

      </div>
    </div>
  );
};

export default LoginPage;