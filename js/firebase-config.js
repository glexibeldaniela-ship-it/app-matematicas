// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqSVoNR5y3kXb-Aihf1UwmvTwo1T0xm_8",
  authDomain: "mateedupro2026-897fa.firebaseapp.com",
  projectId: "mateedupro2026-897fa",
  storageBucket: "mateedupro2026-897fa.firebasestorage.app",
  messagingSenderId: "242144964491",
  appId: "1:242144964491:web:04eb900f523a91ef66498e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("Firebase configurado correctamente");