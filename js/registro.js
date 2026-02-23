import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("form-registro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const rol = document.getElementById("tipo-usuario").value;
    const nomComp = `${document.getElementById("nombre1").value} ${document.getElementById("nombre2").value} ${document.getElementById("apellido1").value} ${document.getElementById("apellido2").value}`;

    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, "usuarios", userCred.user.uid), {
            cedula: document.getElementById("cedula").value,
            nombreCompleto: nomComp,
            rol: rol,
            año: rol === "estudiante" ? document.getElementById("año").value : "N/A",
            seccion: rol === "estudiante" ? document.getElementById("seccion").value : "N/A",
            uid: userCred.user.uid
        });
        alert("¡Registro exitoso!");
        window.location.href = "index.html";
    } catch (err) { alert("Error: " + err.message); }
});
