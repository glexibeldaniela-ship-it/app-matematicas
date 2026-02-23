import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const formLogin = document.getElementById("form-login");

if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const pass = document.getElementById("password").value;

        try {
            // 1. Iniciar sesión
            const credencial = await signInWithEmailAndPassword(auth, email, pass);
            const uid = credencial.user.uid;

            // 2. Buscar el rol en Firestore
            const docRef = doc(db, "usuarios", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const rol = docSnap.data().rol;
                console.log("Bienvenido, tu rol es:", rol);

                // 3. Redirección inteligente
                if (rol === "admin") {
                    window.location.href = "administrador/dashboard.html";
                } else if (rol === "profesor") {
                    window.location.href = "profesor/dashboard.html";
                } else {
                    window.location.href = "estudiante.html";
                }
            } else {
                alert("Error: No tienes un rol asignado.");
            }
        } catch (error) {
            alert("Usuario o clave incorrectos");
            console.error(error);
        }
    });
}
