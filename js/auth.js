import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
    const url = window.location.href;

    if (user) {
        try {
            const docSnap = await getDoc(doc(db, "usuarios", user.uid));
            
            if (docSnap.exists()) {
                const rol = docSnap.data().rol;
                console.log("Rol detectado:", rol);

                // REDIRECCIÓN PARA MÓVILES (Rutas flexibles)
                if (rol === "admin" && !url.includes("administrador")) {
                    window.location.assign("../administrador/dashboard.html");
                } 
                else if (rol === "profesor" && !url.includes("profesor")) {
                    // Si estamos en la raíz, entramos a la carpeta profesor
                    if(url.includes("index.html") || url.endsWith("/")) {
                        window.location.assign("profesor/panel.html");
                    } else {
                        window.location.assign("../profesor/panel.html");
                    }
                } 
                else if (rol === "estudiante" && !url.includes("estudiante")) {
                    if(url.includes("index.html") || url.endsWith("/")) {
                        window.location.assign("estudiante/aula.html");
                    } else {
                        window.location.assign("../estudiante/aula.html");
                    }
                }
            }
        } catch (error) {
            console.error("Error en el portero:", error);
        }
    } else {
        // Si no hay sesión y trata de entrar a carpetas, al login
        if (url.includes("profesor") || url.includes("estudiante") || url.includes("administrador")) {
            window.location.assign("../index.html");
        }
    }
});
