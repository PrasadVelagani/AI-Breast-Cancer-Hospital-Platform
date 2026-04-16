import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { FlaskConical, Upload, Play, Download } from "lucide-react";

const AnalyzePatient = () => {

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const hospitalId = localStorage.getItem("hospitalId");

  // ✅ LOAD PATIENTS (hospital-based)
  useEffect(() => {
    if (!hospitalId) return;

    const loadPatients = async () => {
      const snap = await getDocs(
        collection(db, "hospitals", hospitalId, "patients")
      );

      setPatients(
        snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      );
    };

    loadPatients();
  }, [hospitalId]);

  // 🔥 RUN AI
  const runAI = async () => {

    if (!file || !selectedPatient) {
      alert("Select patient & image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patient", selectedPatient);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      setResult(data);

    } catch {
      alert("Backend error ❌");
    }

    setLoading(false);
  };

  // 📄 DOWNLOAD
  const downloadReport = () => {
    if (!result?.report) {
      alert("Report not ready");
      return;
    }

    window.open(
      `http://127.0.0.1:5000/download-report/${result.report}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">

      {/* HEADER */}
      <h1 className="flex items-center gap-3 text-4xl font-bold mb-10">
        <FlaskConical className="text-blue-400" size={34} />
        Run AI Analysis
      </h1>

      {/* CARD */}
      <div className="glass-card p-8 max-w-xl mx-auto">

        {/* PATIENT */}
        <select
          className="input-dark"
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option>Select Patient</option>
          {patients.map(p => (
            <option key={p.id}>{p.name}</option>
          ))}
        </select>

        {/* FILE */}
        <div className="mt-4 flex items-center gap-3">
          <Upload />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={runAI}
          className="primary-btn mt-6 flex items-center gap-2"
        >
          <Play size={16} />
          {loading ? "Running..." : "Run AI Diagnosis"}
        </button>

        {/* RESULT */}
        {loading && <p className="mt-4">Running AI...</p>}

        {result && (
          <div className="mt-8 glass-card p-4">

            <h2 className="text-xl font-bold mb-2">
              Result: {result.prediction}
            </h2>

            <p>Confidence: {result.confidence}%</p>

            <p className={`font-bold ${
              result.risk === "High Risk"
                ? "text-red-400"
                : result.risk === "Medium Risk"
                ? "text-yellow-400"
                : "text-green-400"
            }`}>
              Risk Level: {result.risk}
            </p>

            <img
              src={`http://127.0.0.1:5000/uploads/${result.gradcam}`}
              alt="GradCAM"
              className="mt-4 rounded"
            />

            <button
              onClick={downloadReport}
              className="primary-btn mt-4 flex items-center gap-2"
            >
              <Download size={16} />
              Download Report
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default AnalyzePatient;