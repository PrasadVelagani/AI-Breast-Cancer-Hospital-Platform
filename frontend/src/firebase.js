import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 
const firebaseConfig = {
  apiKey: "AIzaSyATgvhuwLEKWXAiFddfLyGDvd3LNA4VSYM",
  authDomain: "ai-breast-cancer-db.firebaseapp.com",
  projectId: "ai-breast-cancer-db",
  storageBucket: "ai-breast-cancer-db.firebasestorage.app",
  messagingSenderId: "308949230985",
  appId: "1:308949230985:web:33dc1887c5387f6ab4ad58",
};

const app = initializeApp(firebaseConfig);

// 🔥 Firestore DB
export const db = getFirestore(app);
export const auth = getAuth(app);