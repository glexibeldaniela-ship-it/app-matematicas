import { auth, db } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const userInfo = document.getElementById("user-info");
const btnLogout = document.getElementById("btn-logout");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().rol === "admin") {
            // AQUÍ ESTABA EL ERROR, YA LO CAMBIÉ A "Conectado"
            userInfo.innerText = "Conectado como: " + docSnap.data().nombre;
        } else {
            window.location.href = "../index.html";
        }
    } else {
        window.location.href = "../index.html";
    }
});

btnLogout.addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "../index.html";
    });
});
