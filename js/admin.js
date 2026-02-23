import { auth, db } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const userInfo = document.getElementById("user-info");
const btnLogout = document.getElementById("btn-logout");
const tabla = document.getElementById("tabla-usuarios");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().rol === "admin") {
            // CORRECCIÓN AQUÍ: Busca nombreCompleto o nombre, si no, pone Jose
            const nombreMatias = docSnap.data().nombreCompleto || docSnap.data().nombre || "Jose";
            userInfo.innerText = "Conectado como: " + nombreMatias;
            cargarUsuarios();
        } else {
            window.location.href = "../index.html";
        }
    } else {
        window.location.href = "../index.html";
    }
});

async function cargarUsuarios() {
    if (!tabla) return;
    tabla.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "usuarios"));

    querySnapshot.forEach((doc) => {
        const d = doc.data();
        const fila = `
            <tr>
                <td>${d.cedula || '---'}</td>
                <td>${d.nombreCompleto || d.nombre || 'Sin nombre'}</td>
                <td>${d.año || ''} ${d.seccion || ''}</td>
                <td><span class="rol-tag">${d.rol}</span></td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}

btnLogout.addEventListener("click", () => {
    signOut(auth).then(() => { window.location.href = "../index.html"; });
});
