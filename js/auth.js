import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
    const path = window.location.pathname;

    if (user) {
        try {
            const docSnap = await getDoc(doc(db, "usuarios", user.uid));

            if (docSnap.exists()) {
                const rol = docSnap.data().rol;
                
                // Redirección inteligente basada en rol y ubicación actual
                if (rol === "admin" && !path.includes("/administrador/")) {
                    window.location.href = "/administrador/administrador.html";
                } 
                else if (rol === "profesor" && !path.includes("/profesor/")) {
                    window.location.href = "/profesor/panel.html";
                } 
                else if (rol === "estudiante" && !path.includes("/estudiantes/")) {
                    window.location.href = "/estudiantes/aula.html";
                }
            }
        } catch (error) {
            console.error("Error verificando sesión:", error);
        }
    } else {
        // Si no hay sesión y el usuario intenta entrar a una carpeta privada, va al login
        if (path.includes("/profesor/") || path.includes("/estudiantes/") || path.includes("/administrador/")) {
            window.location.href = "/index.html";
        }
    }
});
