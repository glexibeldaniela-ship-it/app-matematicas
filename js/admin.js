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
            userInfo.innerText = "Conectado como: " + docSnap.data().nombre;
            cargarUsuarios(); // <--- Llamamos a la función para ver a la gente
        } else {
            window.location.href = "../index.html";
        }
    } else {
        window.location.href = "../index.html";
    }
});

// FUNCIÓN PARA TRAER A TODOS LOS USUARIOS DE FIREBASE
async function cargarUsuarios() {
    tabla.innerHTML = ""; // Limpiar tabla
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    
    querySnapshot.forEach((doc) => {
        const datos = doc.data();
        const fila = `
            <tr>
                <td>${datos.nombre}</td>
                <td>${datos.correo}</td>
                <td><span class="rol-tag">${datos.rol}</span></td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}

btnLogout.addEventListener("click", () => {
    signOut(auth).then(() => { window.location.href = "../index.html"; });
});
