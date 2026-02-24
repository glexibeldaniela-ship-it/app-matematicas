import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const form = document.getElementById("login-form");
const errorMsg = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    errorMsg.textContent = "";
    await signInWithEmailAndPassword(auth, email, password);
    // NO redirigimos aquí
    // auth.js se encargará automáticamente
  } catch (error) {
    errorMsg.textContent = "Correo o contraseña incorrectos";
  }
});