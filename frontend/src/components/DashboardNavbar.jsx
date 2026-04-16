import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc
} from "firebase/firestore";

const DashboardNavbar = ({ title }) => {

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const role = localStorage.getItem("userRole");
      const email = localStorage.getItem("doctorEmail"); // ✅ FIXED
      const hospitalId = localStorage.getItem("hospitalId"); // ✅ ADD THIS

      // ================= DOCTOR =================
      if (role === "doctor" && email && hospitalId) {

        const q = query(
          collection(db, "hospitals", hospitalId, "doctors"),
          where("email", "==", email)
        );

        const snapshot = await getDocs(q);

        for (const d of snapshot.docs) {
          await updateDoc(d.ref, {
            status: "inactive"
          });
        }

        await signOut(auth);

        navigate("/role-select");

        localStorage.clear();

        logout();

        return;
      }

      // ================= ADMIN =================
      if (role === "admin") {
        await signOut(auth);

        navigate("/");

        localStorage.clear();

        logout();

        return;
      }

      // ================= DEFAULT =================
      await signOut(auth);
      navigate("/");
      localStorage.clear();
      logout();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-teal-700 text-white p-4 flex justify-between">
      <h1>{title}</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardNavbar;