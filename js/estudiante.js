import { auth, db } from "./firebase-config.js";
import { doc, getDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Elementos de la interfaz
const repasoBox = document.getElementById("repaso-box");
const btnExamen = document.getElementById("btn-hacer-examen");
const notasLapsos = {
    l1: document.getElementById("l1"),
    l2: document.getElementById("l2"),
    l3: document.getElementById("l3")
};

// 1. CARGAR CONTENIDO DEL PROFESOR Y NOTAS
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        // Cargar Notas en progreso.html
        if (notasLapsos.l1) {
            notasLapsos.l1.innerText = userData.notaL1 || "0";
            notasLapsos.l2.innerText = userData.notaL2 || "0";
            notasLapsos.l3.innerText = userData.notaL3 || "0";
        }

        // Cargar Evaluaciones en aula.html
        if (repasoBox) {
            const evalQuery = query(collection(db, "evaluaciones"), where("estado", "==", "activo"));
            const evalSnap = await getDocs(evalQuery);
            
            repasoBox.innerHTML = "<h3>📖 Repaso Disponible</h3>";
            evalSnap.forEach((docEval) => {
                const data = docEval.data();
                repasoBox.innerHTML += `
                    <div class="tema-card">
                        <h4>${data.titulo}</h4>
                        <p>${data.contenidoRepaso}</p>
                        <small>Tiempo: ${data.tiempoMinutos} min</small>
                    </div>
                `;
                // Desbloquear botón al cargar repaso
                if(btnExamen) {
                    btnExamen.disabled = false;
                    btnExamen.innerText = "Iniciar Examen (" + data.tiempoMinutos + " min)";
                }
            });
        }
    }
});

// 2. GENERAR PDF CON MEMBRETE (Para progreso.html)
const btnDescargar = document.getElementById("btn-descargar-examen");
if (btnDescargar) {
    btnDescargar.addEventListener("click", async () => {
        const user = auth.currentUser;
        const docSnap = await getDoc(doc(db, "usuarios", user.uid));
        const data = docSnap.data();

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        // Membrete Oficial solicitado
        pdf.setFontSize(10);
        pdf.text("REPÚBLICA BOLIVARIANA DE VENEZUELA", 105, 15, { align: "center" });
        pdf.text("MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN", 105, 20, { align: "center" });
        pdf.text("UNIDAD EDUCATIVA CECILIA NÚÑEZ SUCRE", 105, 25, { align: "center" });
        pdf.text("MUNICIPIO MARA - PARROQUIA LA SIERRITA - ESTADO ZULIA", 105, 30, { align: "center" });

        pdf.line(20, 35, 190, 35);

        // Datos del Alumno
        pdf.setFontSize(12);
        pdf.text(`ESTUDIANTE: ${data.nombreCompleto}`, 20, 45);
        pdf.text(`CÉDULA: V-${data.cedula}`, 20, 52);
        pdf.text(`AÑO Y SECCIÓN: ${data.año} ${data.seccion}`, 20, 59);
        pdf.text(`FECHA DE DESCARGA: ${new Date().toLocaleDateString()}`, 20, 66);

        // Cuadro de Notas
        pdf.text("RESUMEN DE CALIFICACIONES (Escala 1-20)", 20, 80);
        pdf.text(`1er Lapso: ${data.notaL1 || 0} pts`, 30, 90);
        pdf.text(`2do Lapso: ${data.notaL2 || 0} pts`, 30, 100);
        pdf.text(`3er Lapso: ${data.notaL3 || 0} pts`, 30, 110);

        pdf.save(`Boleta_${data.cedula}.pdf`);
    });
}
