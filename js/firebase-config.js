// 🔥 CONFIGURACIÓN FIREBASE COMPLETA

// Importaciones necesarias
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuración de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyCqSVoNR5y3kXb-Aihf1UwmvTwo1T0xm_8",
  authDomain: "mateedupro2026-897fa.firebaseapp.com",
  projectId: "mateedupro2026-897fa",
  storageBucket: "mateedupro2026-897fa.firebasestorage.app",
  messagingSenderId: "242144964491",
  appId: "1:242144964491:web:04eb900f523a91ef66498e"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
const auth = getAuth(app);
const db = getFirestore(app);

// Exportar para usar en otros archivos
export { auth, db };