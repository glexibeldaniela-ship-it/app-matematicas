import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const uid = userCredential.user.uid;

    // Buscar datos en Firestore
    const docRef = doc(db, "usuarios", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      if (data.rol === "estudiante") {
        window.location.href = "estudiantes/aula.html";
      }

      if (data.rol === "profesor") {
        window.location.href = "profesor/panel.html";
      }

      if (data.rol === "admin") {
        window.location.href = "administrador/dashboard.html";
      }

    } else {
      alert("No se encontraron datos del usuario");
    }

  } catch (error) {
    alert("Error: " + error.message);
  }
});