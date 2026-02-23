import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Esta función redirige al usuario según su rol
export function verificarRol() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const docRef = doc(db, "usuarios", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const rol = docSnap.data().rol;
                const path = window.location.pathname;

                if (rol === "admin" && !path.includes("administrador")) {
                    window.location.href = "/administrador/dashboard.html";
                } else if (rol === "profesor" && !path.includes("profesor")) {
                    window.location.href = "/profesor/panel.html";
                } else if (rol === "estudiante" && !path.includes("estudiante")) {
                    window.location.href = "/estudiante/aula.html";
                }
            }
        } else {
            if (!window.location.pathname.includes("index.html") && !window.location.pathname.includes("registro.html")) {
                window.location.href = "/index.html";
            }
        }
    });
}
