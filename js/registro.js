import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("form-registro");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const cedula = document.getElementById("cedula").value;
    const n1 = document.getElementById("nombre1").value;
    const n2 = document.getElementById("nombre2").value;
    const a1 = document.getElementById("apellido1").value;
    const a2 = document.getElementById("apellido2").value;
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const rolSeleccionado = document.getElementById("tipo-usuario").value;
    const año = document.getElementById("año").value;
    const seccion = document.getElementById("seccion").value;

    try {
        const credencial = await createUserWithEmailAndPassword(auth, email, pass);
        const user = credencial.user;

        await sendEmailVerification(user);

        await setDoc(doc(db, "usuarios", user.uid), {
            cedula: cedula,
            nombreCompleto: `${n1} ${n2} ${a1} ${a2}`,
            correo: email,
            rol: rolSeleccionado,
            año: rolSeleccionado === "estudiante" ? año : "N/A",
            seccion: rolSeleccionado === "estudiante" ? seccion : "N/A",
            notas: { lapso1: 0, lapso2: 0, lapso3: 0, promedioFinal: 0 },
            fechaRegistro: new Date()
        });

        alert("¡Registro exitoso! Revisa tu correo.");
        window.location.href = "index.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
});
