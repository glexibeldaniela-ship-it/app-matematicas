// ✅ CORREGIDO: Importación desde la misma carpeta 'js'
import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const btn = document.getElementById("login");

btn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Por favor, completa todos los campos para entrar a MateEduPro2026.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Buscamos en la colección "usuarios" usando el UID del usuario autenticado
    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("Error: El usuario existe en Auth pero no en la matriz de Firestore.");
      return;
    }

    const data = docSnap.data();
    const rol = data.rol; // Aquí detectará "admin" (en minúsculas como en tu foto)

    console.log("Acceso concedido a MateEduPro2026. Rol:", rol);

    // ✅ CORREGIDO: Redirecciones exactas a tus archivos dashboard.html
    if (rol === "admin") {
      window.location.href = "./administrador/dashboard.html"; 
    } else if (rol === "profesor") {
      window.location.href = "./profesor/dashboard.html"; 
    } else if (rol === "estudiante") {
      window.location.href = "estudiante.html"; // Está en la raíz, no lleva carpeta
    } else {
      alert("Rol no reconocido en el sistema: " + rol);
    }

  } catch (error) {
    // Si la contraseña o correo están mal en MateEduPro2026
    alert("Error de autenticación: " + error.message);
  }
});
