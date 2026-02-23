import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        await signInWithEmailAndPassword(auth, document.getElementById("email").value, document.getElementById("password").value);
        window.location.href = "index.html"; // El auth.js redirigirá según rol
    } catch (err) { alert("Datos incorrectos"); }
});
