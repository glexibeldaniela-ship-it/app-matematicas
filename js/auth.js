import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docSnap = await getDoc(doc(db, "usuarios", user.uid));
        if (docSnap.exists()) {
            const datos = docSnap.data();
            const rol = datos.rol; // Lee "admin" de tu imagen
            const path = window.location.pathname;

            // Redirección por Rol
            if (rol === "admin" && !path.includes("administrador")) {
                window.location.assign("../administrador/administrador.html");
            } 
            else if (rol === "profesor" && !path.includes("profesor")) {
                window.location.assign("../profesor/panel.html");
            } 
            else if (rol === "estudiante" && !path.includes("estudiantes")) {
                window.location.assign("../estudiantes/aula.html");
            }
        }
    } else {
        if (!window.location.pathname.includes("index.html")) {
            window.location.assign("../index.html");
        }
    }
});
