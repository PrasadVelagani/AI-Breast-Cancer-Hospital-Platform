import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { predictCancer, generateReport } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

const PatientDashboard = () => {
  const { logout } = useAuth();

  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!image) {
      alert("Please upload an image first");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await predictCancer(image);
      setResult(res.data);
      await addDoc(collection(db, "analysisHistory"), {
  patientEmail: "patient@hospital.com", // later from auth
  prediction: res.data.prediction,
  confidence: res.data.confidence,
  risk: res.data.risk_level,
  gradcamImage: res.data.gradcam_image,
  createdAt: serverTimestamp(),
});

    } catch (e) {
      setError("AI analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    if (!result) return;
    const res = await generateReport(result);
    window.open(`http://localhost:5000/${res.data.report_path}`, "_blank");
  };
const navigate = useNavigate();
<button
  onClick={() => navigate("/patient/history")}
  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
>
  View History
</button>

  const RiskBadge = ({ level }) => {
    const map = {
      "High Risk": "bg-red-100 text-red-700",
      "Medium Risk": "bg-yellow-100 text-yellow-700",
      "Low Risk": "bg-green-100 text-green-700",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[level] || "bg-gray-100 text-gray-700"}`}>
        {level}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Patient Dashboard</h1>
          <p className="text-sm text-gray-500">
            Upload histopathology image to get AI-assisted insights
          </p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
        >
          Logout
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Upload Image</h3>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="mb-4"
          />

          {image && (
            <p className="text-sm text-gray-600 mb-4">
              Selected: <b>{image.name}</b>
            </p>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Analyzing..." : "Analyze Image (AI)"}
          </button>

          {error && <p className="text-red-600 mt-4">{error}</p>}

          <p className="text-xs text-red-600 mt-6">
            This AI system provides decision support only. Final diagnosis must be
            made by a qualified medical professional.
          </p>
        </div>

        {/* Result Card */}
        {result && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">AI Analysis Result</h3>
              <RiskBadge level={result.risk_level} />
            </div>

            <div className="space-y-2">
              <p>
                <b>Prediction:</b>{" "}
                <span className="font-semibold">{result.prediction}</span>
              </p>
              <p>
                <b>Confidence:</b> {result.confidence}%
              </p>
            </div>

            {/* Grad-CAM */}
            {result.gradcam_image && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Grad-CAM Visualization</h4>
                <img
                  src={`http://localhost:5000/uploads/${result.gradcam_image}`}
                  alt="Grad-CAM"
                  className="rounded-lg border"
                />
              </div>
            )}

            <button
              onClick={handleReport}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Download Medical Report (PDF)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
