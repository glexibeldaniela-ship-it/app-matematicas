import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  const docRef = doc(db, "usuarios", user.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists() || docSnap.data().rol !== "admin") {
    alert("Acceso denegado: No tienes permisos de administrador.");
    window.location.href = "../index.html";
    return;
  }

  const datos = docSnap.data();
  console.log("Administrador autenticado:", datos.nombre);

  // AUTOMATIZACIÓN: Si tienes un elemento con id="nombreAdmin" en tu HTML, se pondrá solo
  const saludo = document.getElementById("nombreAdmin");
  if(saludo) saludo.innerText = datos.nombre;
});

// FUNCIÓN PARA CERRAR SESIÓN
const btnCerrar = document.getElementById("btnCerrarSesion");
if(btnCerrar) {
    btnCerrar.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "../index.html";
    });
}
