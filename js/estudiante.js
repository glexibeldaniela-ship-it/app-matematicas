import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Si no hay nadie, al login
    window.location.href = "index.html";
    return;
  }

  const docSnap = await getDoc(doc(db, "usuarios", user.uid));

  // ✅ SEGURIDAD: Solo permite entrar si el rol es "estudiante"
  if (!docSnap.exists() || docSnap.data().rol !== "estudiante") {
    alert("Acceso denegado: Esta zona es solo para alumnos.");
    window.location.href = "index.html";
    return;
  }

  const datos = docSnap.data();
  // Mostramos el nombre en el HTML
  document.getElementById("saludoEstudiante").innerText = "¡Hola, " + datos.nombre + "!";
  console.log("Estudiante autenticado en MateEduPro2026");
});

// Botón cerrar sesión
document.getElementById("btnSalir").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
