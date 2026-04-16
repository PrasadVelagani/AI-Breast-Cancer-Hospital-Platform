import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

const HospitalSignup = () => {

  const [hospitalName, setHospitalName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "hospitals", user.uid), {
        hospitalId: user.uid,
        hospitalName,
        email,
        phone,
        city,
        district,
        state,
        pincode,
        createdAt: new Date()
      });

      localStorage.setItem("hospitalId", user.uid);
      localStorage.setItem("hospitalName", hospitalName);

      alert("Hospital Registered Successfully");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-800 p-6">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Register Your Hospital
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Create your secure hospital account
        </p>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            placeholder="Hospital Name"
            value={hospitalName}
            onChange={(e)=>setHospitalName(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <input
            placeholder="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <input
            placeholder="Phone Number"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <div className="grid grid-cols-2 gap-4">

            <input
              placeholder="City"
              value={city}
              onChange={(e)=>setCity(e.target.value)}
              className="p-3 border rounded-lg"
            />

            <input
              placeholder="District"
              value={district}
              onChange={(e)=>setDistrict(e.target.value)}
              className="p-3 border rounded-lg"
            />

          </div>

          <div className="grid grid-cols-2 gap-4">

            <input
              placeholder="State"
              value={state}
              onChange={(e)=>setState(e.target.value)}
              className="p-3 border rounded-lg"
            />

            <input
              placeholder="Pincode"
              value={pincode}
              onChange={(e)=>setPincode(e.target.value)}
              className="p-3 border rounded-lg"
            />

          </div>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Register Hospital
          </button>

        </form>

      </div>

    </div>
  );
};

export default HospitalSignup;