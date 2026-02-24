import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase-config.js";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const rol = docSnap.data().rol;

      if (rol === "admin") {
        window.location.href = "administrador/dashboard.html";
      } 
      else if (rol === "profesor") {
        window.location.href = "profesor/panel.html";
      } 
      else if (rol === "estudiante") {
        window.location.href = "estudiantes/aula.html";
      }
    }
  }
});