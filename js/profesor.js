// ✅ CORREGIDO: Se cambió "./firebase.js" por el nombre real "./firebase-config.js"
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    // ✅ CORREGIDO: Ruta para salir al login desde la carpeta /profesor/
    window.location.href = "../index.html";
    return;
  }

  const docRef = doc(db, "usuarios", user.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    window.location.href = "../index.html";
    return;
  }

  const datos = docSnap.data();

  // ✅ CORREGIDO: Validación estricta de rol para evitar intrusos
  if (datos.rol !== "profesor") {
    console.error("Acceso denegado: El usuario no es profesor");
    window.location.href = "../index.html";
    return;
  }

  console.log("Profesor verificado:", datos.nombre);
});

// ✅ CORREGIDO: Verificación de existencia del botón antes de añadir el evento
const btnLogout = document.getElementById("logout");
if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "../index.html";
    } catch (error) {
      alert("Error al cerrar sesión: " + error.message);
    }
  });
}
