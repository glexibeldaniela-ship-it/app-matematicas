import { auth, db } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const userInfo = document.getElementById("user-info");
const btnLogout = document.getElementById("btn-logout");
const tabla = document.getElementById("tabla-usuarios");
const btnPdf = document.getElementById("btn-descargar-pdf");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().rol === "admin") {
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

// FUNCIÓN PARA GENERAR EL PDF
btnPdf.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Membrete (Encabezado)
    doc.setFontSize(18);
    doc.text("MateEduPro - Reporte de Usuarios", 14, 20);
    doc.setFontSize(11);
    doc.text("Administrador: Jose", 14, 30);
    doc.text("Fecha: " + new Date().toLocaleDateString(), 14, 35);

    // Crear la tabla en el PDF
    doc.autoTable({
        html: '#tabla-datos',
        startY: 45,
        theme: 'grid',
        headStyles: { fillColor: [44, 62, 80] }
    });

    doc.save("Lista_Usuarios_MateEduPro.pdf");
});

btnLogout.addEventListener("click", () => {
    signOut(auth).then(() => { window.location.href = "../index.html"; });
});
