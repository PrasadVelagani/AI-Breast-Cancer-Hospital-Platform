# 🧠 AI Breast Cancer Hospital Platform

An end-to-end **AI-powered healthcare web application** for breast cancer detection using deep learning, Grad-CAM visualization, and hospital management features.

---

## 🚀 Features

* 🏥 Hospital Registration & Login
* 👨‍⚕️ Doctor Dashboard
* 👩‍⚕️ Patient Management System
* 🧠 AI Breast Cancer Detection (Deep Learning)
* 🔥 Grad-CAM Visualization (Explainable AI)
* 📄 Automatic PDF Report Generation
* 📅 Appointment Scheduling System
* 📊 Report History Tracking

---

## 🧠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Firebase Authentication

### Backend

* Flask (Python)
* TensorFlow / Keras
* OpenCV
* ReportLab (PDF generation)

### Database

* Firebase Firestore

---

## 📊 Dataset

This project uses the **BreakHis Dataset (Breast Cancer Histopathological Database)**.

👉 Download dataset from:
https://www.kaggle.com/datasets/ambarish/breakhis

### 📁 Dataset Structure

After downloading, place dataset like this:

```
BreakHis/
   ├── benign/
   ├── malignant/
```

Update dataset path in training script if needed.

---

## ⚙️ Project Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/PrasadVelagani/AI-Breast-Cancer-Hospital-Platform.git
cd AI-Breast-Cancer-Hospital-Platform
```

---

## 🔧 Backend Setup (Flask)

```
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

### ▶️ Run Backend

```
python app.py
```

Server runs at:

```
http://127.0.0.1:5000
```

---

## 💻 Frontend Setup (React)

```
cd frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🧠 Model Training (Optional)

To train model:

```
python train.py
```

👉 Output:

* Trained model (.h5)
* Precision-Recall Curve
* Accuracy metrics

---

## 📄 Report Generation

* After AI prediction → PDF report generated
* Includes:

  * Patient details
  * Prediction
  * Confidence
  * Risk level
  * Grad-CAM image

---

## 🌐 Deployment

### Backend

* Render (Flask API)

### Frontend

* Vercel (React App)

---

## 🔐 Important Notes

* Dataset is **not included** due to size limitations
* Model file is excluded from GitHub (large size)
* Ensure correct file paths before running

---

## 💡 Future Improvements

* 🔐 Role-based authentication
* ☁️ Cloud model hosting
* 📊 Advanced analytics dashboard
* 📱 Mobile app integration

---

## 👨‍💻 Author

**Durga Prasad Velagani**

* GitHub: https://github.com/PrasadVelagani
* LinkedIn: https://www.linkedin.com/in/durga-prasad-velagani-5b7920303/

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and support!

---
