import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

  // Si no hay usuario logueado → regresar al login
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  try {
    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // Si NO es admin → sacarlo
      if (data.rol !== "admin") {
        alert("Acceso denegado. Solo administrador.");
        window.location.href = "../index.html";
      }

    } else {
      window.location.href = "../index.html";
    }

  } catch