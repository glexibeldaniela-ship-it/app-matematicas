import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const btn = document.getElementById("login");

btn.addEventListener("click", async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("No existe el rol");
      return;
    }

    const rol = docSnap.data().rol;

    if (rol === "admin") {
      window.location.href = "administrador/dashboard.html";
    } else if (rol === "profesor") {
      window.location.href = "profesor/dashboard.html";
    } else {
      alert("Rol no válido");
    }

  } catch (error) {
    alert("Error al iniciar sesión");
  }

});