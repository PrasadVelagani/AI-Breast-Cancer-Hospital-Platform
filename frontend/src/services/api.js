// 🔥 BASE URL
const BASE_URL = "http://localhost:5000/api";

// 🔮 AI Prediction (used in Hospital + Patient dashboards)
export const predictCancer = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    body: formData
  });

  return await res.json();
};


// Same function used by AnalyzePatient page
export const analyzeImage = predictCancer;


// 📄 Generate PDF Report
export const generateReport = async (data) => {
  const res = await fetch(`${BASE_URL}/api/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return await res.json();
};
