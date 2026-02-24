import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ Usuario conectado:", user.email);
  } else {
    console.log("❌ No hay usuario conectado");
  }
});