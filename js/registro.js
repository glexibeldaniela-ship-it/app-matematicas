import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("form-registro").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const rol = document.getElementById("tipo-usuario").value;
    
    // BLOQUEO: Solo puede existir UN profesor en el sistema
    if (rol === "profesor") {
        const q = query(collection(db, "usuarios"), where("rol", "==", "profesor"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            alert("Acceso denegado: Ya existe un profesor registrado en el sistema.");
            return; // Detiene el proceso
        }
    }

    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const nomComp = `${document.getElementById("nombre1").value} ${document.getElementById("nombre2").value} ${document.getElementById("apellido1").value} ${document.getElementById("apellido2").value}`;

    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, "usuarios", userCred.user.uid), {
            cedula: document.getElementById("cedula").value,
            nombreCompleto: nomComp,
            rol: rol,
            año: rol === "estudiante" ? document.getElementById("año").value : "N/A",
            seccion: rol === "estudiante" ? document.getElementById("seccion").value : "N/A",
            uid: userCred.user.uid,
            examenIniciado: false, // Para el control de trampas
            examenCompletado: false
        });

        alert("¡Registro exitoso!");
        window.location.href = "/index.html";
    } catch (err) { 
        alert("Error al registrar: " + err.message); 
    }
});
