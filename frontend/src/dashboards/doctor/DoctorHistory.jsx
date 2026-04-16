import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const DoctorHistory = () => {
  const [patientHistory, setPatientHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const snapshot = await getDocs(collection(db, "analysisHistory"));
      setPatientHistory(snapshot.docs.map(doc => doc.data()));
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Patient Analysis History
      </h1>

      <div className="space-y-4">
        {patientHistory.length === 0 && (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
            No analysis records available yet.
          </div>
        )}

        {patientHistory.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                Patient: {item.patientEmail}
              </p>
              <p className="text-sm text-gray-500">
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

export default DoctorHistory;
