import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { LogOut } from "lucide-react";

const DoctorDashboard = () => {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const hospitalId = localStorage.getItem("hospitalId");

  // 🔒 PROTECT ROUTE
  useEffect(() => {
    const role = localStorage.getItem("userRole");

    if (!user || role !== "doctor") {
      navigate("/doctor-login");
    }
  }, [user, navigate]);

  // 📥 LOAD APPOINTMENTS
  useEffect(() => {

    if (!user?.email || !hospitalId) {
      setLoading(false);
      return;
    }

    const loadAppointments = async () => {
      try {

        const q = query(
          collection(db, "hospitals", hospitalId, "appointments"),
          where("doctorEmail", "==", user.email)
        );

        const snapshot = await getDocs(q);

        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setAppointments(list);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();

  }, [user, hospitalId]);

  // 🔥 SORT
  const sortedAppointments = [...appointments].sort(
    (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
  );

  // ✅ MARK COMPLETE
  const markComplete = async (id) => {
    await updateDoc(
      doc(db, "hospitals", hospitalId, "appointments", id),
      { status: "Completed" }
    );

    setAppointments(prev =>
      prev.map(a =>
        a.id === id ? { ...a, status: "Completed" } : a
      )
    );
  };

  // 📄 DOWNLOAD REPORT
  const downloadReport = async (a) => {

    try {
      const hospitalName = localStorage.getItem("hospitalName");

      const res = await fetch("http://127.0.0.1:5000/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hospitalName,
          doctorName: a.doctorName,
          patientName: a.patientName,
          age: a.age,
          gender: a.gender,
          prediction: a.prediction,
          confidence: a.confidence,
          risk: a.risk,
          gradcam: a.gradcamImage,
          original: a.originalImage
        })
      });

      const data = await res.json();

      window.open(`http://127.0.0.1:5000/download/${data.pdf}`);

    } catch (err) {
      console.log(err);
      alert("Download failed ❌");
    }
  };

  // 🔥 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate("/doctor-login");
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
          👨‍⚕️ My Appointments
        </h1>




<button
  onClick={handleLogout}
  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-400/40 text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white transition duration-300 shadow-lg hover:shadow-red-500/40"
>
  <LogOut size={16} />
  Logout
</button>

      </div>

      {/* LOADING */}
      {loading && <p className="text-gray-400">Loading...</p>}

      {/* EMPTY */}
      {!loading && sortedAppointments.length === 0 && (
        <p className="text-gray-500">No appointments</p>
      )}

      {/* CARDS */}
      <div className="grid md:grid-cols-2 gap-6">

        {sortedAppointments.map((a) => (

          <div key={a.id} className="glass-card p-6 glow">

            {/* NAME */}
            <h2 className="text-xl font-bold text-blue-400 mb-2">
              {a.patientName}
            </h2>

            {/* TYPE */}
            {a.type === "manual" ? (
              <>
                <p><b>Prediction:</b> Manual Case</p>
                <p><b>Confidence:</b> -</p>
                <p className="text-green-400 font-bold">Manual</p>
              </>
            ) : (
              <>
                <p><b>Prediction:</b> {a.prediction}</p>
                <p><b>Confidence:</b> {a.confidence}%</p>

                <p className={`font-bold ${
                  a.risk === "High Risk"
                    ? "text-red-400"
                    : a.risk === "Medium Risk"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}>
                  {a.risk}
                </p>
              </>
            )}

            {/* DATE */}
            <p className="mt-2"><b>Date:</b> {a.date || "N/A"}</p>
            <p><b>Time:</b> {a.time || "N/A"}</p>

            {/* STATUS */}
            <p className="mt-2">
              <b>Status:</b>{" "}
              <span className="text-blue-300">{a.status}</span>
            </p>

            {/* IMAGE */}
            {a.gradcamImage && (
              <img
                src={`http://127.0.0.1:5000/uploads/${a.gradcamImage}`}
                alt="GradCAM"
                className="mt-4 w-40 rounded-lg border border-gray-700"
              />
            )}

            {/* BUTTONS */}
            <div className="flex gap-3 mt-5">

  <button
    onClick={() => downloadReport(a)}
    className="action-btn download-btn"
  >
    📄 Download
  </button>

  {a.status !== "Completed" && (
    <button
      onClick={() => markComplete(a.id)}
      className="action-btn complete-btn"
    >
      ✅ Complete
    </button>
  )}

</div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default DoctorDashboard;