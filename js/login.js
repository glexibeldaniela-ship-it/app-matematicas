import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const form = document.getElementById("form-login");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        // El auth.js se encargará de mandarlo a su panel
        alert("¡Bienvenido a MateEduPro!");
        window.location.href = "index.html"; 
    } catch (error) {
        alert("Error al entrar: Verifique sus datos");
    }
});
