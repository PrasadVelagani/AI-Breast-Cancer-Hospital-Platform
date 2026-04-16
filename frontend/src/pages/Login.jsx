import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("hospitalUser"));

    if(user?.email === email && user?.password === password){
      navigate("/role-select");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow w-[350px]">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input placeholder="Email" className="w-full mb-3 p-2 border rounded"
          onChange={(e)=>setEmail(e.target.value)} required />

        <input type="password" placeholder="Password" className="w-full mb-3 p-2 border rounded"
          onChange={(e)=>setPassword(e.target.value)} required />

        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
