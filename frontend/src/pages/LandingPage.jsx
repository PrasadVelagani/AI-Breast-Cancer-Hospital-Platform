import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LandingPage = () => {

  const navigate = useNavigate();

  const symptoms = [
    "Breast Lump",
    "Breast Pain",
    "Nipple Discharge",
    "Skin Dimpling",
    "Breast Redness",
    "Change in Breast Shape",
    "Armpit Lump"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % symptoms.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [symptoms.length]); // ✅ warning fix

  const features = [
    { title: "AI Diagnosis", desc: "Upload histopathology images and receive instant AI predictions." },
    { title: "Explainable AI", desc: "GradCAM visualization explains how AI predicted the result." },
    { title: "Automated Reports", desc: "Generate detailed medical PDF reports automatically." },
    { title: "Doctor Dashboard", desc: "Doctors manage appointments and patient reports." }
  ];

  const workflow = [
    { step: "Upload Image", desc: "Hospital uploads histopathology image." },
    { step: "AI Analysis", desc: "Deep learning model analyzes cancer patterns." },
    { step: "GradCAM", desc: "Explainable AI highlights tumor regions." },
    { step: "Report Generation", desc: "AI creates medical diagnosis report." }
  ];

  return (
    <div className="w-full overflow-x-hidden text-white">

      {/* HERO */}
      <div className="relative h-screen w-full overflow-hidden">

        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src="/hospital.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/60"></div>

        {/* SYMPTOMS */}
        <div className="absolute bottom-10 w-full text-center">
          <h3 className="text-2xl font-semibold text-white/80 animate-fade">
            {symptoms[index]}
          </h3>
        </div>

        <div className="relative z-10 flex flex-col h-full">

          {/* NAVBAR */}
          <div className="flex justify-between items-center px-10 py-6 backdrop-blur-md">

            <h1 className="text-2xl font-bold">
              AI Breast Cancer Care Platform
            </h1>

            <div className="space-x-4">

              {/* 🔥 LOGIN */}
              <button
                onClick={() => navigate("/login")}
                className="btn-login"
              >
                Login
              </button>

              {/* 🔥 SIGNUP */}
              <button
                onClick={() => navigate("/signup")}
                className="btn-yellow"
              >
                Sign Up
              </button>

            </div>

          </div>

          {/* HERO TEXT */}
          <div className="flex flex-col justify-center items-center text-center flex-1 px-10">

            <h2 className="text-6xl font-bold mb-6 leading-tight">
              AI-Powered Breast Cancer
              <br />
              Detection & Care Platform
            </h2>

            <p className="max-w-3xl text-lg text-gray-200 leading-relaxed">
              Our platform helps hospitals diagnose breast cancer faster using
              Artificial Intelligence and Explainable AI. Hospitals can upload
              histopathology images, receive AI predictions, generate medical
              reports, and manage patients securely.
            </p>

            {/* 🔥 GET STARTED */}
            <button
              onClick={() => navigate("/signup")}
              className="mt-8 btn-gradient px-8 py-3 text-lg rounded-xl"
            >
              Get Started
            </button>

          </div>

        </div>

      </div>

      {/* FEATURES */}
      <div className="py-20 bg-gray-100 text-black text-center">

        <h2 className="text-4xl font-bold mb-12">
          Platform Features
        </h2>

        <div className="flex justify-center gap-10 flex-wrap">

          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white shadow-lg rounded-xl p-6 w-64 animate-slide"
            >
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}

        </div>

      </div>

      {/* WORKFLOW */}
      <div className="py-20 bg-white text-black text-center">

        <h2 className="text-4xl font-bold mb-12">
          How Our AI Works
        </h2>

        <div className="flex justify-center gap-10 flex-wrap">

          {workflow.map((step, i) => (
            <div
              key={i}
              className="bg-gray-100 shadow-lg rounded-xl p-6 w-64 animate-slide"
            >
              <h3 className="text-xl font-bold mb-2">{step.step}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}

        </div>

      </div>

      {/* ANIMATIONS */}
      <style>{`

        .animate-fade{
          animation: fade 2s ease;
        }

        @keyframes fade{
          0%{opacity:0; transform:translateY(20px)}
          100%{opacity:1; transform:translateY(0)}
        }

        .animate-slide{
          animation: slideUp 1s ease;
        }

        @keyframes slideUp{
          from{
            opacity:0;
            transform:translateY(40px)
          }
          to{
            opacity:1;
            transform:translateY(0)
          }
        }

        /* 🔥 BUTTON STYLES */
        .btn-gradient {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          padding: 10px 22px;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(99,102,241,0.5);
        }

        .btn-outline {
          border: 1px solid white;
          color: white;
          padding: 10px 22px;
          border-radius: 10px;
          font-weight: 600;
          transition: 0.3s;
        }

        .btn-outline:hover {
          background: white;
          color: #1e3a8a;
        }
          /* 🔥 SIGNUP HERO BUTTON */
.btn-yellow {
  position: relative;
  background: linear-gradient(135deg, #facc15, #f59e0b);
  color: black;
  padding: 10px 24px;
  border-radius: 12px;
  font-weight: 700;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* ✨ GLOW */
.btn-yellow::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.5), transparent);
  transform: translateX(-100%);
}

/* ✨ SHINE EFFECT */
.btn-yellow:hover::before {
  transform: translateX(100%);
  transition: 0.6s;
}

/* 🔥 HOVER */
.btn-yellow:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 0 25px rgba(250,204,21,0.7);
}

/* 💥 PULSE ANIMATION */
.btn-yellow {
  animation: pulseGlow 2s infinite;
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 0px rgba(250,204,21,0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(250,204,21,0.8);
  }
  100% {
    box-shadow: 0 0 0px rgba(250,204,21,0.4);
  }
}
  /* 🔵 LOGIN BUTTON */
.btn-login {
  position: relative;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  padding: 10px 24px;
  border-radius: 12px;
  font-weight: 600;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* ✨ SHINE */
.btn-login::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent);
  transform: translateX(-100%);
}

.btn-login:hover::before {
  transform: translateX(100%);
  transition: 0.6s;
}

/* 🔥 HOVER */
.btn-login:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 0 20px rgba(59,130,246,0.6);
}

/* 💫 SOFT PULSE (LESS THAN SIGNUP) */
.btn-login {
  animation: loginPulse 3s infinite;
}

@keyframes loginPulse {
  0% { box-shadow: 0 0 0px rgba(59,130,246,0.3); }
  50% { box-shadow: 0 0 15px rgba(59,130,246,0.6); }
  100% { box-shadow: 0 0 0px rgba(59,130,246,0.3); }
}

      `}</style>

    </div>
  );
};

export default LandingPage;