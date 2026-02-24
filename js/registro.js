import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("form-registro").addEventListener("submit", async (e) => {
    e.preventDefault();

    const rol = document.getElementById("tipo-usuario").value;

    // 1. BLOQUEO DE SEGURIDAD: Solo un profesor (José Fernández)
    if (rol === "profesor") {
        try {
            const q = query(collection(db, "usuarios"), where("rol", "==", "profesor"));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                alert("Acceso denegado: El sistema ya cuenta con un profesor registrado.");
                return; 
            }
        } catch (error) {
            console.error("Error al verificar profesor:", error);
        }
    }

    // 2. RECOPILACIÓN DE DATOS
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    
    // Unificamos los nombres en una sola variable
    const n1 = document.getElementById("nombre1").value;
    const n2 = document.getElementById("nombre2").value || "";
    const a1 = document.getElementById("apellido1").value;
    const a2 = document.getElementById("apellido2").value || "";
    const nombreUnificado = `${n1} ${n2} ${a1} ${a2}`.replace(/\s+/g, ' ').trim();

    try {
        // 3. CREAR USUARIO EN AUTHENTICATION
        const userCred = await createUserWithEmailAndPassword(auth, email, pass);
        
        // 4. GUARDAR EN FIRESTORE (Usando 'nombre' para que coincida con tu base de datos)
        await setDoc(doc(db, "usuarios", userCred.user.uid), {
            cedula: document.getElementById("cedula").value,
            nombre: nombreUnificado, // CAMBIO AQUÍ: Ahora coincide con tu Firebase
            rol: rol,
            año: rol === "estudiante" ? document.getElementById("año").value : "N/A",
            seccion: rol === "estudiante" ? document.getElementById("seccion").value : "N/A",
            uid: userCred.user.uid,
            examenIniciado: false, 
            examenCompletado: false,
            correo: email // Guardamos el correo también por si lo necesitas
        });

        alert("¡Registro exitoso! Bienvenido a MateEduPro.");
        window.location.href = "index.html"; 
        
    } catch (err) { 
        // Manejo de errores comunes
        if (err.code === 'auth/email-already-in-use') {
            alert("Este correo ya está registrado.");
        } else if (err.code === 'auth/weak-password') {
            alert("La contraseña debe tener al menos 6 caracteres.");
        } else {
            alert("Error al registrar: " + err.message);
        }
    }
});
