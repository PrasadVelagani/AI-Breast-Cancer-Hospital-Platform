import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const PatientHistory = () => {
  const [history, setHistory] = useState([]);

  // TEMP: later auth nundi vastundi
  const patientEmail = "patient@hospital.com";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, "analysisHistory"),
          where("patientEmail", "==", patientEmail)
        );

        const snapshot = await getDocs(q);
        setHistory(snapshot.docs.map(doc => doc.data()));
      } catch (err) {
        console.error("Error fetching patient history:", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        My Analysis History
      </h1>

      <div className="space-y-4">
        {history.length === 0 && (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
            No analysis history available yet.
          </div>
        )}

        {history.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                Prediction: {item.prediction}
              </p>
              <p className="text-sm text-gray-500">
                Confidence: {item.confidence}%
              </p>
            </div>

            <div className="text-right">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.risk === "High Risk"
                    ? "bg-red-100 text-red-700"
                    : item.risk === "Medium Risk"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.risk}
              </span>

              <p className="text-xs text-gray-400 mt-1">
                {item.createdAt?.toDate
                  ? item.createdAt.toDate().toLocaleString()
                  : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientHistory;
