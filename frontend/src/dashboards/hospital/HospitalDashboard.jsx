import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";

// ICONS
import { FaUserMd, FaUsers, FaCalendarCheck, FaFileAlt } from "react-icons/fa";
import { MdOutlineScience, MdAnalytics } from "react-icons/md";
import { AiOutlineAudit } from "react-icons/ai";
 import { LogOut } from "lucide-react";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const hospitalId = localStorage.getItem("hospitalId");

  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    reports: 0
  });

  // 🔥 LOAD DATA
  useEffect(() => {
    if (!hospitalId) return;

    const loadStats = async () => {
      const doctorsSnap = await getDocs(collection(db, "hospitals", hospitalId, "doctors"));
      const patientsSnap = await getDocs(collection(db, "hospitals", hospitalId, "patients"));
      const appointmentsSnap = await getDocs(collection(db, "hospitals", hospitalId, "appointments"));
      const reportsSnap = await getDocs(collection(db, "hospitals", hospitalId, "reports"));

      setStats({
        doctors: doctorsSnap.size,
        patients: patientsSnap.size,
        appointments: appointmentsSnap.size,
        reports: reportsSnap.size
      });
    };

    loadStats();
  }, [hospitalId]);

  // 🔥 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* HEADER WITH LOGOUT */}
      <div className="flex justify-between items-start mb-12">

        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome Hospital Admin 
          </h1>

          <p className="text-gray-400 mt-2">
            Manage patients, doctors and AI diagnosis from one platform
          </p>
        </div>

        {/* 🔥 LOGOUT BUTTON */}
       



<button
  onClick={handleLogout}
  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-400/40 text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white transition duration-300 shadow-lg hover:shadow-red-500/40"
>
  <LogOut size={16} />
  Logout
</button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">

        <StatCard title="Doctors" value={stats.doctors} icon={<FaUserMd />} />
        <StatCard title="Patients" value={stats.patients} icon={<FaUsers />} />
        <StatCard title="Appointments" value={stats.appointments} icon={<FaCalendarCheck />} />
        <StatCard title="Reports" value={stats.reports} icon={<FaFileAlt />} />

      </div>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <DashboardCard icon={<FaUserMd />} title="Manage Doctors" desc="Add & manage doctors" onClick={() => navigate("/hospital/doctors")} />
        <DashboardCard icon={<FaUsers />} title="Manage Patients" desc="Register & track patients" onClick={() => navigate("/hospital/patients")} />
        <DashboardCard icon={<MdOutlineScience />} title="Run AI Analysis" desc="Analyze images using AI" onClick={() => navigate("/hospital/analyze")} />
        <DashboardCard icon={<FaFileAlt />} title="Report History" desc="View AI reports" onClick={() => navigate("/hospital/reports")} />
        <DashboardCard icon={<AiOutlineAudit />} title="Explainability Audit" desc="Grad-CAM audit" onClick={() => navigate("/hospital/audit")} />
        <DashboardCard icon={<MdAnalytics />} title="Appointments" desc="Manage consultations" onClick={() => navigate("/hospital/appointments")} />

      </div>

    </div>
  );
};

/* STAT CARD */
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow border border-white/10 flex items-center justify-between hover:scale-105 transition">
    
    <div>
      <h2 className="text-sm text-gray-400">{title}</h2>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>

    <div className="text-3xl text-blue-400">
      {icon}
    </div>

  </div>
);

/* DASHBOARD CARD */
const DashboardCard = ({ icon, title, desc, onClick }) => {

  const colorMap = {
    "Manage Doctors": "from-blue-500 to-cyan-400",
    "Manage Patients": "from-green-500 to-emerald-400",
    "Run AI Analysis": "from-purple-500 to-pink-400",
    "Report History": "from-red-500 to-orange-400",
    "Explainability Audit": "from-yellow-400 to-amber-500",
    "Appointments": "from-indigo-500 to-blue-400"
  };

  const gradient = colorMap[title];

  return (
    <div
      onClick={onClick}
      className="relative p-[1px] rounded-2xl hover:scale-[1.04] transition cursor-pointer"
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} blur opacity-30`}></div>

      <div className="relative bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10">

        <div className="text-3xl mb-3 text-blue-400">
          {icon}
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">
          {title}
        </h3>

        <p className="text-sm text-gray-400">
          {desc}
        </p>

      </div>
    </div>
  );
};

export default HospitalDashboard;