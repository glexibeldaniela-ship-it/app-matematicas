import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const formRegistro = document.getElementById("form-registro");

formRegistro.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // 1. Creamos el usuario en Authentication
        const credencial = await createUserWithEmailAndPassword(auth, email, password);
        const usuario = credencial.user;

        // 2. Guardamos su información y el ROL automático en Firestore
        await setDoc(doc(db, "usuarios", usuario.uid), {
            nombre: nombre,
            correo: email,
            rol: "estudiante", // <--- Aquí se asigna el rol solo
            fecha: new Date()
        });

        alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
        window.location.href = "index.html";

    } catch (error) {
        console.error("Error al registrar:", error);
        alert("No se pudo crear la cuenta: " + error.message);
    }
});
