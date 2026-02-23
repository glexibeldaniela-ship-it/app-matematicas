import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const btn = document.getElementById("login");

btn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("Error: No se encontró el perfil del usuario en la base de datos.");
      return;
    }

    const data = docSnap.data();
    const rol = data.rol;

    // REDIRECCIÓN AUTOMÁTICA SEGÚN ROL
    if (rol === "admin") {
      window.location.href = "./administrador/dashboard.html"; 
    } else if (rol === "profesor") {
      window.location.href = "./profesor/panel.html"; 
    } else if (rol === "estudiante") {
      window.location.href = "estudiante.html"; // Está en la raíz
    } else {
      alert("Rol no reconocido: " + rol);
    }

  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
  }
});
