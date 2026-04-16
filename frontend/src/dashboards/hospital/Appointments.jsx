import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp
} from "firebase/firestore";
import { db } from "../../firebase";
import { Calendar, PlusCircle } from "lucide-react";

const Appointments = () => {

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const hospitalId = localStorage.getItem("hospitalId");

  // 🔥 LOAD DATA
  useEffect(() => {
    if (!hospitalId) return;

    const load = async () => {

      const p = await getDocs(collection(db,"hospitals",hospitalId,"patients"));
      const d = await getDocs(collection(db,"hospitals",hospitalId,"doctors"));
      const a = await getDocs(collection(db,"hospitals",hospitalId,"appointments"));

      setPatients(p.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setDoctors(d.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const sorted = a.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((x,y)=>y.createdAt?.seconds - x.createdAt?.seconds);

      setAppointments(sorted);
    };

    load();
  }, [hospitalId]);

  // 🔥 CREATE APPOINTMENT
  const createAppointment = async () => {

    if (!selectedPatient || !selectedDoctor || !date || !time) {
      alert("Fill all fields ❌");
      return;
    }

    const reportsSnap = await getDocs(
      collection(db, "hospitals", hospitalId, "reports")
    );

    const patientReports = reportsSnap.docs
      .map(doc => doc.data())
      .filter(r => r.patientName === selectedPatient.name);

    const latest = patientReports[patientReports.length - 1];

    const newData = {
      patientName: selectedPatient.name,
      age: selectedPatient.age,
      gender: selectedPatient.gender,

      doctorName: selectedDoctor.name,
      doctorEmail: selectedDoctor.email,

      prediction: latest?.prediction || "Manual Case",
      confidence: latest?.confidence || "-",
      risk: latest?.risk || "N/A",

      date,
      time,
      status: "Pending",
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(
      collection(db, "hospitals", hospitalId, "appointments"),
      newData
    );

    // ✅ instant UI update
    setAppointments(prev => [{ id: docRef.id, ...newData }, ...prev]);

    alert("Appointment Created ✅");

    setSelectedPatient(null);
    setSelectedDoctor(null);
    setDate("");
    setTime("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">

      {/* HEADER */}
      <h1 className="flex items-center gap-3 text-3xl font-bold mb-8">
        <Calendar className="text-blue-400"/>
        Appointments
      </h1>

      {/* 🔥 FIXED GRID LAYOUT */}
      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">

        {/* ✅ LEFT FORM (NO EMPTY SPACE) */}
        <div className="glass-card p-5 space-y-3 h-fit sticky top-6">

          <h2 className="text-md font-semibold flex items-center gap-2">
            <PlusCircle size={16}/> Create Appointment
          </h2>

          <select
            className="input-dark"
            onChange={(e)=>{
              const p = patients.find(x=>x.id===e.target.value);
              setSelectedPatient(p);
            }}
          >
            <option>Select Patient</option>
            {patients.map(p=>(
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            className="input-dark"
            onChange={(e)=>{
              const d = doctors.find(x=>x.id===e.target.value);
              setSelectedDoctor(d);
            }}
          >
            <option>Select Doctor</option>
            {doctors.map(d=>(
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <input
            type="date"
            className="input-dark"
            onChange={(e)=>setDate(e.target.value)}
          />

          <input
            type="time"
            className="input-dark"
            onChange={(e)=>setTime(e.target.value)}
          />

          <button
  onClick={createAppointment}
  className="btn-premium w-full py-3 text-base rounded-xl hover:scale-[1.02] transition-all duration-300"
>
  Create Appointment
</button>

        </div>

        {/* ✅ RIGHT LIST */}
        <div className="space-y-4">

          {appointments.map(a=>(
            <div key={a.id} className="glass-card card-hover p-5">

              <div className="flex justify-between items-center">

                <div>
                  <h3 className="text-lg font-bold text-blue-400">
                    {a.patientName}
                  </h3>

                  <p className="text-sm text-gray-400">
                    Doctor: {a.doctorName}
                  </p>
                </div>

                {/* STATUS */}
                <span className={`px-3 py-1 rounded-full text-xs ${
                  a.status === "Pending"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
                }`}>
                  {a.status}
                </span>

              </div>

              <div className="mt-3 text-sm space-y-1">
                <p>Date: {a.date}</p>
                <p>Time: {a.time}</p>
                <p>Prediction: {a.prediction}</p>
              </div>

              {/* RISK */}
              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs ${
                a.risk === "High Risk"
                  ? "bg-red-500/20 text-red-400"
                  : a.risk === "Medium Risk"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-green-500/20 text-green-400"
              }`}>
                {a.risk}
              </span>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default Appointments;