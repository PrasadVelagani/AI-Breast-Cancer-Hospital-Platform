import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp
} from "firebase/firestore";
import { db } from "../../firebase";
import { FlaskConical, Upload, Play, Download } from "lucide-react";

const AIAnalyses = () => {

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const hospitalId = localStorage.getItem("hospitalId");

  // 🔥 LOAD PATIENTS
  useEffect(() => {
    if (!hospitalId) return;

    const loadPatients = async () => {
      const snapshot = await getDocs(
        collection(db, "hospitals", hospitalId, "patients")
      );
      setPatients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    loadPatients();
  }, [hospitalId]);

  // 🔥 LOAD DOCTORS
  useEffect(() => {
    if (!hospitalId) return;

    const loadDoctors = async () => {
      const snapshot = await getDocs(
        collection(db, "hospitals", hospitalId, "doctors")
      );

      setDoctors(
        snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(doc => doc.status === "active")
      );
    };

    loadDoctors();
  }, [hospitalId]);

  // 🔥 RUN AI
  const runAI = async () => {

    if (!file || !selectedPatient || !selectedDoctor) {
      alert("Select patient, doctor & image ❌");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);

      // SAVE REPORT
      await addDoc(
        collection(db, "hospitals", hospitalId, "reports"),
        {
          patientName: selectedPatient.name,
          age: selectedPatient.age,
          gender: selectedPatient.gender,
          doctorName: selectedDoctor.name,
          doctorEmail: selectedDoctor.email,
          prediction: data.prediction,
          confidence: data.confidence,
          risk: data.risk,
          gradcamImage: data.gradcam,
          originalImage: data.original,
          createdAt: Timestamp.now(),
        }
      );

      // AUTO APPOINTMENT
      if (data.confidence > 85) {
        const now = new Date();
        const date = now.toISOString().split("T")[0];
        const time = now.toTimeString().slice(0,5);

        await addDoc(
          collection(db, "hospitals", hospitalId, "appointments"),
          {
            patientName: selectedPatient.name,
            age: selectedPatient.age,
            gender: selectedPatient.gender,
            doctorName: selectedDoctor.name,
            doctorEmail: selectedDoctor.email,
            prediction: data.prediction,
            confidence: data.confidence,
            risk: data.risk,
            gradcamImage: data.gradcam,
            originalImage: data.original,
            date,
            time,
            type: "auto",
            status: "Pending",
            createdAt: Timestamp.now(),
          }
        );
      }

      alert("AI Analysis Completed ✅");

    } catch (err) {
      console.log(err);
      alert("Error ❌");
    }

    setLoading(false);
  };

  // 🔥 DOWNLOAD REPORT
  const downloadReport = async () => {

    const hospitalName = localStorage.getItem("hospitalName");

    const res = await fetch("http://127.0.0.1:5000/generate-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hospitalName,
        doctorName: selectedDoctor.name,
        patientName: selectedPatient.name,
        age: selectedPatient.age,
        gender: selectedPatient.gender,
        prediction: result.prediction,
        confidence: result.confidence,
        risk: result.risk,
        gradcam: result.gradcam,
        original: result.original
      })
    });

    const data = await res.json();
    window.open(`http://127.0.0.1:5000/download/${data.pdf}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">

      {/* HEADER */}
      <h1 className="flex items-center gap-3 text-4xl font-bold mb-10">
        <FlaskConical className="text-blue-400" size={34} />
        AI Analysis
      </h1>

      {/* CARD */}
      <div className="glass-card card-hover p-8 max-w-xl mx-auto space-y-4">

        {/* PATIENT */}
        <select
          className="input-dark w-full"
          value={selectedPatientId}
          onChange={(e) => {
            setSelectedPatientId(e.target.value);
            setSelectedPatient(patients.find(p => p.id === e.target.value));
          }}
        >
          <option>Select Patient</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {/* DOCTOR */}
        <select
          className="input-dark w-full"
          onChange={(e) =>
            setSelectedDoctor(doctors.find(d => d.id === e.target.value))
          }
        >
          <option>Select Doctor</option>
          {doctors.map(d => (
            <option key={d.id} value={d.id}>Dr. {d.name}</option>
          ))}
        </select>

        {/* FILE */}
        <div className="flex items-center gap-3 mt-2">
          <Upload />
          <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
        </div>

        {/* 🔥 RUN AI BUTTON */}
        <button
          onClick={runAI}
          disabled={loading}
          className={`btn-premium w-full py-3 text-base rounded-xl flex items-center justify-center gap-2 mt-4 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          <Play size={18} />
          {loading ? "Running..." : "Run AI"}
        </button>

        {/* RESULT */}
        {result && (
          <div className="mt-6 glass-card p-4">

            <h2 className="text-xl font-bold mb-3">AI Result</h2>

            <p><b>Prediction:</b> {result.prediction}</p>
            <p><b>Confidence:</b> {result.confidence}%</p>

            <p className={`font-bold ${
              result.risk === "High Risk"
                ? "text-red-400"
                : result.risk === "Medium Risk"
                ? "text-yellow-400"
                : "text-green-400"
            }`}>
              Risk: {result.risk}
            </p>

            <img
              src={`http://127.0.0.1:5000/uploads/${result.gradcam}`}
              className="mt-4 w-64 rounded"
            />

            {/* 🔥 DOWNLOAD BUTTON */}
            <button
              onClick={downloadReport}
              className="btn-premium w-full py-3 text-base rounded-xl flex items-center justify-center gap-2 mt-4"
            >
              <Download size={18} />
              Download Report
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default AIAnalyses;