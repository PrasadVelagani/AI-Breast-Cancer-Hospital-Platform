import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { Microscope, AlertTriangle } from "lucide-react";

const ExplainabilityAudit = () => {

  const [reports, setReports] = useState([]);
  const hospitalId = localStorage.getItem("hospitalId");

  // 🔥 LOAD REPORTS
  useEffect(() => {

    if (!hospitalId) return;

    const loadReports = async () => {
      const q = query(
        collection(db, "hospitals", hospitalId, "reports"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      setReports(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    };

    loadReports();

  }, [hospitalId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">

      {/* HEADER */}
      <h1 className="flex items-center gap-3 text-4xl font-bold mb-10">
        <Microscope className="text-blue-400" size={34} />
        Explainability Audit
      </h1>

      {reports.length === 0 && (
        <p className="text-gray-400">No AI analysis available yet.</p>
      )}

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {reports.map((r) => (
          <div key={r.id} className="glass-card p-5 hover:scale-[1.02] transition">

            {/* HEADER */}
            <div className="mb-3">
              <h2 className="text-lg font-bold text-blue-400">
                {r.patientName}
              </h2>
              <p className="text-sm text-gray-400">
                Doctor: {r.doctorName}
              </p>
            </div>

            {/* DETAILS */}
            <div className="mb-3 text-sm space-y-1">
              <p><b>Prediction:</b> {r.prediction}</p>
              <p><b>Confidence:</b> {r.confidence}%</p>
            </div>

            {/* RISK BADGE */}
            <div className="mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                r.risk === "High Risk"
                  ? "bg-red-500/20 text-red-400"
                  : r.risk === "Medium Risk"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-green-500/20 text-green-400"
              }`}>
                {r.risk}
              </span>
            </div>

            {/* IMAGE */}
            {r.gradcamImage && (
              <img
                src={`http://127.0.0.1:5000/uploads/${r.gradcamImage}`}
                alt="GradCAM"
                className="rounded w-full mb-3 border border-white/10"
              />
            )}

            {/* DATE */}
            {r.createdAt && (
              <p className="text-xs text-gray-500">
                {new Date(r.createdAt.seconds * 1000).toLocaleString()}
              </p>
            )}

          </div>
        ))}

      </div>
    </div>
  );
};

export default ExplainabilityAudit;