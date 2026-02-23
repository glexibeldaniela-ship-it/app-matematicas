import { auth, db } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const userInfo = document.getElementById("user-info");
const btnLogout = document.getElementById("btn-logout");
const tabla = document.getElementById("tabla-usuarios");
const btnPdf = document.getElementById("btn-pdf");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const docRef = doc(db, "usuarios", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().rol === "admin") {
                // CAMBIO AQUÍ: Ahora busca 'nombre' (como en tu foto) o 'nombreCompleto' por si acaso
                const nombreAdmin = docSnap.data().nombre || docSnap.data().nombreCompleto || "Administrador";
                
                if (userInfo) {
                    userInfo.innerText = "Conectado como: " + nombreAdmin;
                }
                cargarUsuarios();
            } else {
                // Si el rol no es admin exacto, rebota al login
                window.location.href = "../index.html";
            }
        } catch (error) {
            console.error("Error al verificar privilegios:", error);
            window.location.href = "../index.html";
        }
    } else {
        window.location.href = "../index.html";
    }
});

async function cargarUsuarios() {
    if (!tabla) return;
    tabla.innerHTML = "<tr><td colspan='4' style='text-align:center;'>Cargando base de datos...</td></tr>";

    try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        tabla.innerHTML = ""; 

        querySnapshot.forEach((doc) => {
            const d = doc.data();
            // CAMBIO AQUÍ: También ajustamos la tabla para que lea 'nombre'
            const nombreMostrar = d.nombre || d.nombreCompleto || 'Sin nombre';
            
            const fila = `
                <tr>
                    <td>${d.cedula || '---'}</td>
                    <td>${nombreMostrar}</td>
                    <td>${d.año || ''} ${d.seccion || ''}</td>
                    <td><span class="rol-tag" style="background:#00c2cb22; color:#008a91; padding:4px 10px; border-radius:15px; font-size:12px; font-weight:bold;">${d.rol}</span></td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        tabla.innerHTML = "<tr><td colspan='4'>Error al cargar datos</td></tr>";
    }
}

// GENERACIÓN DE PDF
if (btnPdf) {
    btnPdf.addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        pdf.setFontSize(16);
        pdf.setTextColor(0, 138, 145); // Color turquesa oscuro
        pdf.text("MateEduPro - Reporte General de Usuarios", 14, 20);

        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text("Fecha del reporte: " + new Date
