import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqSVoNR5y3kXb-Aihf1UwmvTwo1T0xm_8",
  authDomain: "mateedupro2026-897fa.firebaseapp.com",
  projectId: "mateedupro2026-897fa",
  storageBucket: "mateedupro2026-897fa.firebasestorage.app",
  messagingSenderId: "242144964491",
  appId: "1:242144964491:web:04eb900f523a91ef66498e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("🔥 Firebase conectado correctamente"); 