import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Login exitoso:", userCredential.user.email);
    alert("Login exitoso");
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error.message);
    alert("Error: " + error.message);
  }
});