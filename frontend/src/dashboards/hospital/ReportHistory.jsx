import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { FileText, Download } from "lucide-react";

const ReportHistory = () => {

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

  // 📄 DOWNLOAD
  const downloadReport = (file) => {
    if (!file) {
      alert("Report not ready yet");
      return;
    }

    window.open(`http://127.0.0.1:5000/reports/${file}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">

      {/* HEADER */}
      <h1 className="flex items-center gap-3 text-4xl font-bold mb-10">
        <FileText className="text-blue-400" size={34} />
        Report History
      </h1>

      {reports.length === 0 && (
        <p className="text-gray-400">No reports available yet.</p>
      )}

      <div className="grid gap-6">

        {reports.map((r) => (
          <div key={r.id} className="glass-card p-6">

            {/* TOP */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-blue-400">
                  {r.patientName}
                </h2>
                <p className="text-gray-400">
                  Age: {r.age} | Gender: {r.gender}
                </p>
              </div>

              {/* RISK BADGE */}
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                r.risk === "High Risk"
                  ? "bg-red-500/20 text-red-400"
                  : r.risk === "Medium Risk"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-green-500/20 text-green-400"
              }`}>
                {r.risk}
              </span>
            </div>

            {/* DETAILS */}
            <div className="mb-4 space-y-1">
              <p><b>Prediction:</b> {r.prediction}</p>
              <p><b>Confidence:</b> {r.confidence}%</p>
            </div>

            {/* IMAGE */}
            {r.gradcamImage && (
              <img
                src={`http://127.0.0.1:5000/uploads/${r.gradcamImage}`}
                alt="GradCAM"
                className="w-64 rounded mb-4 border border-white/10"
              />
            )}

            {/* ACTIONS */}
            <div className="flex justify-between items-center">

              {/* 🔥 SMALL BUTTON */}
              <button
                onClick={() => downloadReport(r.reportFile)}
                className="primary-btn flex items-center gap-2 px-5 py-2 w-fit"
              >
                <Download size={16} />
                Download
              </button>

              {/* DATE */}
              {r.createdAt && (
                <p className="text-sm text-gray-500">
                  {new Date(r.createdAt.seconds * 1000).toLocaleString()}
                </p>
              )}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default ReportHistory;