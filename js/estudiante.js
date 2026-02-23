import { auth, db } from "./firebase-config.js";
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const repasoBox = document.getElementById("repaso-box");
const btnExamen = document.getElementById("btn-hacer-examen");
const timerDisplay = document.getElementById("examen-timer");

let tiempoRestante = 30 * 60; // 30 minutos en segundos
let intervalo;

auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        // Si ya hizo el examen, bloquear acceso
        if (userData.examenCompletado) {
            if(btnExamen) btnExamen.disabled = true;
            if(btnExamen) btnExamen.innerText = "Examen ya realizado";
            return;
        }

        // Cargar Repaso y habilitar botón
        if (repasoBox) {
            const q = query(collection(db, "evaluaciones"), where("estado", "==", "activo"));
            const evalSnap = await getDocs(q);
            evalSnap.forEach((de) => {
                repasoBox.innerHTML = `<h3>${de.data().titulo}</h3><p>${de.data().contenidoRepaso}</p>`;
                if(btnExamen) btnExamen.disabled = false;
            });
        }
    }
});

// INICIAR EXAMEN
if (btnExamen) {
    btnExamen.addEventListener("click", async () => {
        const user = auth.currentUser;
        await updateDoc(doc(db, "usuarios", user.uid), { examenIniciado: true });
        
        btnExamen.style.display = "none";
        iniciarTemporizador();
        
        alert("¡Examen iniciado! Tienes 30 minutos. Si sales de la página, perderás el examen.");
    });
}

function iniciarTemporizador() {
    intervalo = setInterval(() => {
        let mins = Math.floor(tiempoRestante / 60);
        let segs = tiempoRestante % 60;
        timerDisplay.innerText = `Tiempo restante: ${mins}:${segs < 10 ? '0' : ''}${segs}`;
        
        if (tiempoRestante <= 0) {
            finalizarExamen("Tiempo agotado");
        }
        tiempoRestante--;
    }, 1000);

    // DETECTAR TRAMPA: Salir de la pestaña
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            finalizarExamen("Intento de trampa: Salida de pestaña detectada");
        }
    });
}

async function finalizarExamen(motivo) {
    clearInterval(intervalo);
    const user = auth.currentUser;
    await updateDoc(doc(db, "usuarios", user.uid), {
        examenCompletado: true,
        notaL1: 1 // Nota mínima por trampa o tiempo agotado (ajustable)
    });
    alert(motivo + ". Tu examen ha sido enviado automáticamente.");
    window.location.href = "progreso.html";
}
