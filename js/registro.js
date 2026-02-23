import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("form-registro");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    try {
        const credencial = await createUserWithEmailAndPassword(auth, email, pass);
        // AQUÍ ESTÁ EL TRUCO: Se guarda como "estudiante" automáticamente
        await setDoc(doc(db, "usuarios", credencial.user.uid), {
            nombre: nombre,
            correo: email,
            rol: "estudiante"
        });
        alert("¡Registrado con éxito!");
    } catch (error) {
        alert("Error: " + error.message);
    }
});
