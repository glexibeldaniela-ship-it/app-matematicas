import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const btn = document.getElementById("login");

btn.addEventListener("click", async () => {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("No existe el rol en Firestore");
      return;
    }

    const rol = docSnap.data().rol.toLowerCase().trim();

    if (rol === "admin") {
      window.location.href = "admin.html";

    } else if (rol === "profesor") {
      window.location.href = "profesor.html";

    } else if (rol === "estudiante") {
      window.location.href = "estudiante.html";

    } else {
      alert("Rol no válido: " + rol);
    }

  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
  }

});