import { auth, db } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const userInfo = document.getElementById("user-info");
const btnLogout = document.getElementById("btn-logout");
const tabla = document.getElementById("tabla-usuarios");
const btnPdf = document.getElementById("btn-pdf"); // ID Corregido para coincidir con el HTML

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().rol === "admin") {
            const nombreAdmin = docSnap.data().nombreCompleto || "Administrador";
            userInfo.innerText = "Conectado como: " + nombreAdmin;
            cargarUsuarios();
        } else {
            // Si no es admin, lo sacamos por seguridad
            window.location.href = "../index.html";
        }
    } else {
        window.location.href = "../index.html";
    }
});

async function cargarUsuarios() {
    if (!tabla) return;
    tabla.innerHTML = "<tr><td colspan='4'>Cargando base de datos...</td></tr>";
    
    try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        tabla.innerHTML = ""; // Limpiamos el mensaje de carga
        
        querySnapshot.forEach((doc) => {
            const d = doc.data();
            const fila = `
                <tr>
                    <td>${d.cedula || '---'}</td>
                    <td>${d.nombreCompleto || 'Sin nombre'}</td>
                    <td>${d.año || ''} ${d.seccion || ''}</td>
                    <td><span class="rol-tag" style="background:#eee; padding:3px 8px; border-radius:5px; font-size:12px;">${d.rol}</span></td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}

// GENERACIÓN DE PDF PROFESIONAL
if (btnPdf) {
    btnPdf.addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        // Encabezado del Reporte
        pdf.setFontSize(16);
        pdf.text("MateEduPro - Reporte General de Usuarios", 14, 20);
        
        pdf.setFontSize(10);
        pdf.text("Fecha del reporte: " + new Date().toLocaleString(), 14, 30);
        pdf.line(14, 32, 196, 32);

        // Generar tabla desde el HTML
        pdf.autoTable({
            html: '#tabla-datos',
            startY: 40,
            theme: 'striped',
            headStyles: { fillColor: [0, 194, 203] }, // Color Turquesa de tu marca
            styles: { fontSize: 9 }
        });

        pdf.save("Reporte_MateEduPro_General.pdf");
    });
}

// CERRAR SESIÓN
if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        signOut(auth).then(() => {
            window.location.href = "../index.html";
        });
    });
}
